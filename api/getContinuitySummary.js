import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const config = {
    runtime: "nodejs"
}

/**
 * MindWorks Continuity Layer v1
 *
 * This endpoint exists to observe recurrence across reflections.
 */
export default async function handler(request, response) {
    if (request.method !== "POST") {
        return response.status(405).json({
            error: "Method not allowed"
        })
    }

    try {
        const { userId } = request.body || {}

        if (!userId) {
            return response.status(400).json({
                error: "Missing user ID"
            })
        }

        // Retrieve last 10 rows from course_reflections
        const { data: reflectionsData, error: dbError } = await supabase
            .from("course_reflections")
            .select("original_reflection, ai_response, week_number, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(10)

        if (dbError) {
            console.error("DATABASE ERROR:", dbError)
            return response.status(500).json({
                error: "Failed to retrieve reflections"
            })
        }

        const count = reflectionsData?.length || 0

        if (count === 0) {
            return response.status(200).json({
                summary: ""
            })
        }

        if (count === 1) {
            return response.status(200).json({
                summary: ""
            })
        }

        if (count === 2) {
            return response.status(200).json({
                summary: "MindWorks is collecting observations. Patterns become visible through repetition."
            })
        }

        const recentReflections = reflectionsData
            .map((r) => `---
Week: ${r.week_number}
Date: ${r.created_at}
User Observation: ${r.original_reflection}
MindWorks Reflection: ${r.ai_response}`)
            .join("\n\n")

        const systemPrompt = `
You are a continuity observer.

Look across multiple reflections to identify what appears repeatedly.

Do not explain behaviour.
Do not diagnose.
Do not coach.
Do not provide advice.
Do not interpret motivations.
Do not suggest solutions.
Do not use IFS language or parts terminology (managers, exiles, firefighters, protectors).

Remain close to the user's actual words and the structured sequences already identified in the MindWorks Reflections.
Stay observational and restrained. Do not sound like therapy interpretation or productivity coaching.

Output format with five sections:

### What Keeps Reappearing
A short observation of the recurring action, behaviour, or interruption.

### Repeated Sequence
A simple sequence using arrows.
Example:
Intention to start
↓
Pressure or uncertainty
↓
Checking / preparing
↓
Delay

### Primary State
Name the state, pressure, emotional climate, or body condition that appears before the sequence.
Use cautious language. Examples: "Pressure and uncertainty appear before checking or delay." "Chest tension and restlessness appear near the point where attention shifts."
Do not explain what the state means.

### Possible Function
Name what the pattern may be doing, using cautious language only.
Use phrases such as: "may create a pause", "may reduce uncertainty", "may delay exposure", "may provide brief relief", "appears to change the pressure".
Do not present function as fact. Do not say "This means", "This is because", or "This protects the user from".

### What Remains Unclear
Preserve uncertainty.
Examples: "It is not yet clear exactly where the shift occurs." "It is not yet clear whether the same function is present each time." "The relationship between state, response, and delay is still being observed."
`.trim()

        const openAIResponse = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    temperature: 0.5,
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: recentReflections
                        }
                    ]
                })
            }
        )

        const data = await openAIResponse.json()

        if (!openAIResponse.ok) {
            console.error("OPENAI ERROR:", data)
            return response.status(500).json({
                error: data.error?.message || "OpenAI request failed"
            })
        }

        const aiResponse = data.choices?.[0]?.message?.content || ""

        return response.status(200).json({
            summary: aiResponse
        })

    } catch (error) {
        console.error("CONTINUITY SUMMARY ERROR:", error)
        return response.status(500).json({
            error: error.message || "Server error"
        })
    }
}
