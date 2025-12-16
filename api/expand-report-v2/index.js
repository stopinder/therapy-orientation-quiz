export default async function handler(req, res) {
    let body = req.body
    if (typeof body === "string") body = JSON.parse(body)

    const { report } = body || {}
    if (!report) {
        return res.status(400).json({ error: "Missing report" })
    }

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

    const data = await response.json()

    return res.status(200).json({
        text: data.choices[0].message.content
    })
}
