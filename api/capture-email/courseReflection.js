export default async function handler(request, response) {
    if (request.method !== "POST") {
        return response.status(405).json({
            error: "Method not allowed"
        })
    }

    try {
        const { week, reflection } = request.body || {}

        if (!reflection || typeof reflection !== "string") {
            return response.status(400).json({
                error: "Reflection is required."
            })
        }

        const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                temperature: 0.6,
                messages: [
                    {
                        role: "system",
                        content: `
You are the MindWorks reflection engine.

You write in second person.

You are not a therapist, coach, motivator, or diagnostic tool.

Your task is to reflect behavioural sequences involving continuity failure, fragmentation, emotional interruption, avoidance, pressure, and compensatory action.

Do not give advice.
Do not reassure.
Do not diagnose.
Do not use therapy jargon.
Do not use productivity language.
Do not use motivational language.
Do not mention ADHD.
Do not tell the user what to do.

Write calmly, precisely, and behaviourally.

Focus on:
- what the user intended
- where continuity weakened
- what replaced the original intention
- what pressure or emotional shift may have organised the movement
- what pattern is becoming visible

Return 3 short paragraphs.
            `.trim()
                    },
                    {
                        role: "user",
                        content: `
Week: ${week}

User reflection:
${reflection}
            `.trim()
                    }
                ]
            })
        })

        const data = await openAiResponse.json()

        if (!openAiResponse.ok) {
            return response.status(500).json({
                error: data.error?.message || "OpenAI request failed."
            })
        }

        return response.status(200).json({
            reflection: data.choices?.[0]?.message?.content || ""
        })
    } catch (error) {
        return response.status(500).json({
            error: error.message || "Unexpected server error."
        })
    }
}