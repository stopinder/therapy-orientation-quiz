export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    let body = req.body
    if (typeof body === "string") {
        body = JSON.parse(body)
    }

    const { report } = body || {}

    if (typeof report !== "string" || !report.trim()) {
        return res.status(400).json({ error: "Missing report" })
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
                temperature: 0.4,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are expanding an existing reflective report. Do not add diagnoses, advice, or new interpretations."
                    },
                    {
                        role: "user",
                        content: report
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
            text: data.choices?.[0]?.message?.content || ""
        })

    } catch (err) {
        return res.status(500).json({ error: "Server error" })
    }
}
