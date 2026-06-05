import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const config = {
    runtime: "nodejs"
}

export default async function handler(request, response) {

    if (request.method !== "POST") {

        return response.status(405).json({
            error: "Method not allowed"
        })

    }

    try {

        const {
            week,
            reflection,
            userId,
            email
        } = request.body || {}

        if (!reflection || typeof reflection !== "string") {

            return response.status(400).json({
                error: "Reflection is required"
            })

        }

        if (!userId) {

            return response.status(400).json({
                error: "Missing user ID"
            })

        }

        const { data: submissionData } = await supabase
            .from("quiz_submissions")
            .select("quiz_profile_summary")
            .eq("email", email)
            .single()

        const quizProfileSummary = submissionData?.quiz_profile_summary || ""

        console.log("QUIZ PROFILE SUMMARY:", quizProfileSummary)

        const { data: reflectionsData } = await supabase
            .from("course_reflections")
            .select("original_reflection, ai_response")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(3)

        const recentReflections = reflectionsData
            ?.map(r => `User: ${r.original_reflection}\nAI: ${r.ai_response}`)
            .join("\n\n") || "None"

        const weekPrompts = {
            1: `
Many people assume that the difficulty lies in motivation.
They tell themselves they need more discipline, more commitment, more focus, or a better system.
Yet if they look carefully, they often find that intention was present at the beginning.
Something else happened. Attention shifted. A thought appeared. A feeling emerged. The task became heavier.
Something more immediate offered relief. The movement happened so quickly that the transition itself was barely noticed.
The moment of change is usually missing.
This week is about becoming interested in the moment where continuity changes.
Recognize small moments where you begin in one direction and end somewhere else.
Do not try to stop or improve the movement. Simply become more familiar with it.
The task is recognition.
            `.trim(),
            2: "...",
            3: "...",
            4: "...",
            5: "...",
            6: "..."
        }

        const currentWeekPrompt = weekPrompts[week] || ""
        const isWeekOne = parseInt(week) === 1

        const systemContent = isWeekOne
            ? `
You are the MindWorks reflection engine.

You write brief, observational, and non-advisory behavioral reflections.

For Week 1, you must use exactly these four headings:
- What seems to have happened
- Where continuity changed
- The sequence
- One observation to carry forward

Constraints:
- Each section must be 1-3 sentences maximum.
- Keep responses brief, observational, and non-advisory.
- Do not over-explain, diagnose, reassure, or coach.
- Do not produce long analytical paragraphs.
- Do not give advice.
- Do not use therapy jargon.
- Do not mention ADHD.
- Do not sound cheerful.
`.trim()
            : `
You are the MindWorks reflection engine.

You write calm, psychologically precise behavioural reflections.

You are NOT:
- a therapist
- a coach
- motivational
- diagnostic
- reassuring

You identify:
- continuity failure
- interruption
- pressure shifts
- compensatory behaviour
- emotional recoil
- behavioural loops

Do not give advice.
Do not use therapy jargon.
Do not mention ADHD.
Do not sound cheerful.

Return 3 grounded paragraphs.
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

                    temperature: 0.7,

                    messages: [

                        {
                            role: "system",

                            content: systemContent
                        },

                        {
                            role: "user",

                            content: `
QUIZ PROFILE SUMMARY:
${quizProfileSummary}

RECENT REFLECTION HISTORY:
${recentReflections}

CURRENT WEEK FOCUS:
${currentWeekPrompt}

Week: ${week}

Reflection:
${reflection}
                            `.trim()
                        }

                    ]

                })

            }
        )

        const data = await openAIResponse.json()

        if (!openAIResponse.ok) {

            console.error("OPENAI ERROR:", data)

            return response.status(500).json({
                error:
                    data.error?.message ||
                    "OpenAI request failed"
            })

        }

        const aiResponse =
            data.choices?.[0]?.message?.content || ""

        const { error: saveError } = await supabase
            .from("course_reflections")
            .insert([
                {
                    user_id: userId,



                    week_number: week,

                    original_reflection: reflection,

                    ai_response: aiResponse
                }
            ])

        if (saveError) {

            console.error(
                "SUPABASE SAVE ERROR:",
                saveError
            )

            return response.status(500).json({
                error: "Failed to save reflection"
            })

        }

        return response.status(200).json({

            reflection: aiResponse

        })

    } catch (error) {

        console.error(
            "COURSE REFLECTION ERROR:",
            error
        )

        return response.status(500).json({
            error: error.message || "Server error"
        })

    }

}