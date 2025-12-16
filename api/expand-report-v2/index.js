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
                temperature: 0.25,
                messages: [
                    {
                        role: "system",
                        content: `
You are revising reflective language written by a clinician.

Your task is editorial, not interpretive.

Rules:
- Preserve the original meaning, tone, and uncertainty
- Do not add advice, reassurance, diagnosis, or instruction
- Do not introduce new themes, explanations, or interpretations
- Avoid therapeutic clichés and general statements
- Use plain, precise language
- Write as an extension of the original author’s voice
`
                    },
                    {
                        role: "user",
                        content: `
Rewrite the text below into 2–3 short paragraphs.

Your goal is to:
- clarify what is already implied
- make implicit distinctions more explicit
- improve flow and readability

Constraints:
- Every sentence must be directly grounded in the source text
- Do not summarise
- Do not conclude or resolve

TEXT:
<<<
${report}
>>>
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
            text: data.choices?.[0]?.message?.content || ""
        })

    } catch (err) {
        return res.status(500).json({ error: "Server error" })
    }
}
