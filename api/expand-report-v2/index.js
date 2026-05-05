export const config = {
    runtime: "nodejs"
}

const MODE_PROMPTS = {
    overview: `
You are generating a behavioural reflection.

Goal:
Describe exactly what happens when this system operates.

Rules:
- Use "you"
- No explanation
- No causes
- No labels
- No advice
- No reassurance
- No abstract language

Write 4–5 short paragraphs.

Each paragraph must:
- show a sequence
- introduce a NEW pattern
- stay concrete

Include:
- starting with intention but not sustaining
- attention dropping without a clear stop
- effort present but not carrying forward

Include contradiction:
you intend to continue, but you do not sustain it

Tone:
direct, behavioural, slightly exposing
`,

    functioning: `
You are generating a daily functioning reflection.

Goal:
Show what this costs in real life.

Rules:
- Use "you"
- No explanation
- No diagnosis
- No advice

Write 4–5 short paragraphs.

Focus on:
- restarting tasks
- effort not accumulating
- mental fatigue
- inconsistency

Include contradiction:
you are working, but still feel behind
`,

    patterns: `
You are generating a patterns & trade-offs reflection.

Goal:
Show internal contradictions clearly.

Rules:
- Use "you"
- No explanation
- No advice
- No resolution

Write 4–5 short paragraphs.

Include:
- pressure helps you start, but breaks consistency
- disengagement reduces strain, but creates backlog
- bursts of effort produce output, but not stability

End by making it clear:
the pattern continues
`
}

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" })
        }

        let body = req.body

        if (typeof body === "string") {
            try {
                body = JSON.parse(body)
            } catch {
                return res.status(400).json({ error: "Invalid JSON body" })
            }
        }

        const { profile, mode } = body || {}

        if (!profile) {
            return res.status(400).json({ error: "Missing profile" })
        }

        const systemPrompt =
            MODE_PROMPTS[mode] || MODE_PROMPTS.overview

        // 🔴 CRITICAL CHECK
        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({
                error: "Missing OPENAI_API_KEY"
            })
        }

        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4.1-mini",
                    temperature: 0.4,
                    max_tokens: 700,
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: `Profile:\n${JSON.stringify(profile)}`
                        }
                    ]
                })
            }
        )

        const raw = await response.text()

        if (!response.ok) {
            console.error("OpenAI error:", raw)
            return res.status(500).json({
                error: "OpenAI request failed",
                details: raw
            })
        }

        let data
        try {
            data = JSON.parse(raw)
        } catch {
            return res.status(500).json({
                error: "Invalid JSON from OpenAI",
                raw
            })
        }

        const text =
            data?.choices?.[0]?.message?.content?.trim() || ""

        return res.status(200).json({ text })

    } catch (err) {
        console.error("SERVER CRASH:", err)

        return res.status(500).json({
            error: "Server crashed",
            message: err.message
        })
    }
}