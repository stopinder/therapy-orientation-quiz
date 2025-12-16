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
                temperature: 0.55,
                max_tokens: 320,
                messages: [
                    {
                        role: "system",
                        content: `
You generate reflective summaries for users who have completed a therapy-orientation quiz.

Refinement rules:
- Do NOT use metric or label language (e.g. low emotion, high structure)
- Use lived-experience language that shows the pattern indirectly
- Integrate the adaptive logic: how the pattern protects from overwhelm or confusion
- Acknowledge both stability gained and limits introduced
- When mentioning therapy approaches, soften transitions and avoid instructional phrasing
- End with a balanced, agentic closing line (no advice, no invitation, no question)
- Maintain calm, grounded, emotionally precise language
- Total length: 130–180 words
- No diagnosis, reassurance, or interpretation
`
                    },
                    {
                        role: "user",
                        content: `
Profile:
${JSON.stringify(profile, null, 2)}

Write a 2–3 paragraph reflective summary that follows the rules exactly.
`
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
