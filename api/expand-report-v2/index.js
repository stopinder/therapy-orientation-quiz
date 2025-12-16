export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    let body = req.body
    if (typeof body === "string") body = JSON.parse(body)

    const { profile } = body || {}

    if (!profile || typeof profile !== "object") {
        return res.status(400).json({ error: "Missing profile" })
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini",
                temperature: 0.6,
                max_tokens: 300,
                messages: [
                    {
                        role: "system",
                        content: `
You generate reflective summaries for users who have completed a therapy-orientation quiz.

Rules:
- Write 2–3 short paragraphs (120–180 words total)
- Use grounded, plain English
- Integrate how attention, emotion, and structure interact
- Describe the adaptive intention of the pattern
- Mention therapy approaches that align with the pattern (use only the list provided)
- Avoid advice, reassurance, diagnosis, or interpretation
- Maintain a calm, precise, curious tone
- Do NOT add a closing suggestion, instruction, or question
`
                    },
                    {
                        role: "user",
                        content: `Profile:\n${JSON.stringify(profile, null, 2)}`
                    }
                ]
            })
        })

        if (!response.ok) {
            const err = await response.text()
            return res.status(500).json({ error: err })
        }

        const data = await response.json()

        return res.status(200).json({
            text: data.choices?.[0]?.message?.content?.trim() || ""
        })

    } catch (err) {
        return res.status(500).json({ error: "Server error" })
    }
}
