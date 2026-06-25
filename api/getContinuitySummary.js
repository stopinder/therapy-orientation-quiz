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
You are a Pattern Observer.

Look across multiple reflections to identify recurring structural patterns. Look for the broader relationship across observations before naming specific behaviours.

Structural patterns to look for:
Intention -> Pressure / body state -> Movement away from original intention -> Consequence (What changed afterwards? e.g., delay, substitute activity, lingering irritation, defensiveness remaining active, partial settling, no observable change, or postponed action).

Rules:
1. Identify higher-order patterns (e.g., "An intention is followed by pressure or tension, then by a movement away from the original intention").
2. Do not lock onto the most repeated surface behaviour (like "checking messages") too quickly. Use higher-order language where possible.
3. Name specific behaviours (checking messages, scrolling, reorganising notes, delaying, cancelling, withdrawing, staying home, lingering irritation, defensiveness remaining active, partial settling, no observable change, or substitute activities) as variants, not as the whole pattern.
4. Use tentative, observational language (e.g., "This may resemble...", "This appears similar...").
5. Do not diagnose, explain behaviour, coach, advise, or interpret motivations.
6. Do not suggest solutions.
7. Do not use IFS language or parts terminology.
8. Avoid saying behaviours "reduce exposure" unless directly supported.
9. Avoid causal language or explanations (e.g., "avoidance", "distraction", "serve as", "influence the subsequent actions"). Prefer observational wording such as "how these emotional or physical states appear before the shift to another activity or delay".
10. Use "stomach" instead of "tummy".
11. For "Possible Function", prefer wording like: "It is not yet clear which shifts reliably follow the familiar response, or whether the same consequence appears across different situations."

OUTPUT FORMAT:
Your output MUST start with a JSON object, then a newline, then the markdown summary.

Example output:
{
  "status": "established",
  "structural_pattern": "...",
  "sequence": ["...", "..."],
  "primary_state": "...",
  "possible_function": "It is not yet clear which shifts reliably follow the familiar response, or whether the same consequence appears across different situations.",
  "variants": ["...", "..."],
  "unclear_aspects": "..."
}

### What Keeps Reappearing
...

JSON Fields:
- "status": "established" | "collecting" | "insufficient"
- "structural_pattern": Short description of the higher-order pattern
- "sequence": ["Step 1", "Step 2", "Step 3", "Step 4"]
- "primary_state": Description of the state before the shift
- "possible_function": Use tentative wording: "It is not yet clear which shifts reliably follow the familiar response, or whether the same consequence appears across different situations."
- "variants": ["variant 1", "variant 2"]
- "unclear_aspects": What cannot yet be concluded

Markdown Summary sections:
### What Keeps Reappearing
### Repeated Sequence
### Primary State
### Possible Function
### What Remains Unclear

If there is not enough evidence to see a pattern, set status to "insufficient" and provide a neutral message in the JSON and Markdown.
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
                    temperature: 0,
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

        const rawContent = data.choices?.[0]?.message?.content || ""

        // Extract JSON and Markdown
        let jsonResult = {
            status: "insufficient",
            structural_pattern: "",
            sequence: [],
            primary_state: "",
            possible_function: "",
            variants: [],
            unclear_aspects: ""
        }
        let markdownSummary = rawContent

        try {
            const jsonMatch = rawContent.match(/\{[\s\S]*?\}/)
            if (jsonMatch) {
                jsonResult = JSON.parse(jsonMatch[0])
                // Remove the JSON block and any surrounding whitespace or markdown code block markers
                markdownSummary = rawContent.replace(/```json\s*[\s\S]*?```/g, "")
                                            .replace(jsonMatch[0], "")
                                            .trim()
            }
        } catch (e) {
            console.error("JSON PARSE ERROR:", e)
        }

        return response.status(200).json({
            ...jsonResult,
            summary: markdownSummary,
            markdown_summary: markdownSummary
        })

    } catch (error) {
        console.error("CONTINUITY SUMMARY ERROR:", error)
        return response.status(500).json({
            error: error.message || "Server error"
        })
    }
}
