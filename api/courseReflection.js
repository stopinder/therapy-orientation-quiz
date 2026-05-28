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

                            content: `
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
                        },

                        {
                            role: "user",

                            content: `
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