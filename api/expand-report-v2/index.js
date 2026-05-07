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

function sanitizeProfile(profile) {
    try {
        const json = JSON.stringify(profile)

        // Prevent extremely large payloads
        if (json.length > 12000) {
            return json.slice(0, 12000)
        }

        return json
    } catch {
        return ""
    }
}

export default async function handler(req, res) {
    const startTime = Date.now()

    try {
        if (req.method !== "POST") {
            return res.status(405).json({
                error: "Method not allowed"
            })
        }

        if (!process.env.OPENAI_API_KEY) {
            console.error("Missing OPENAI_API_KEY")

            return res.status(500).json({
                error: "Server configuration error"
            })
        }

        let body = req.body

        if (typeof body === "string") {
            try {
                body = JSON.parse(body)
            } catch (err) {
                console.error("Invalid JSON body:", err)

                return res.status(400).json({
                    error: "Invalid JSON body"
                })
            }
        }

        const { profile, mode } = body || {}

        if (!profile) {
            return res.status(400).json({
                error: "Missing profile"
            })
        }

        const systemPrompt =
            MODE_PROMPTS[mode] || MODE_PROMPTS.overview

        const serializedProfile = sanitizeProfile(profile)

        if (!serializedProfile) {
            return res.status(400).json({
                error: "Invalid profile data"
            })
        }

        // Abort hanging requests
        const controller = new AbortController()

        const timeout = setTimeout(() => {
            controller.abort()
        }, 25000)

        let response

        try {
            response = await fetch(
                "https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    signal: controller.signal,
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
                                content: `Profile:\n${serializedProfile}`
                            }
                        ]
                    })
                }
            )
        } catch (fetchError) {
            clearTimeout(timeout)

            console.error("OpenAI fetch failed:", fetchError)

            if (fetchError.name === "AbortError") {
                return res.status(504).json({
                    error: "OpenAI request timeout"
                })
            }

            return res.status(500).json({
                error: "OpenAI connection failed"
            })
        }

        clearTimeout(timeout)

        const raw = await response.text()

        if (!response.ok) {
            console.error("OpenAI API error:", {
                status: response.status,
                body: raw
            })

            return res.status(500).json({
                error: "Reflection generation failed"
            })
        }

        let data

        try {
            data = JSON.parse(raw)
        } catch (parseError) {
            console.error("Failed to parse OpenAI response:", parseError)
            console.error("Raw response:", raw)

            return res.status(500).json({
                error: "Invalid AI response"
            })
        }

        const text =
            data?.choices?.[0]?.message?.content?.trim() || ""

        if (!text) {
            console.error("Empty reflection returned:", data)

            return res.status(500).json({
                error: "Empty reflection generated"
            })
        }

        const duration = Date.now() - startTime

        console.log("Reflection generated successfully:", {
            mode,
            durationMs: duration
        })

        return res.status(200).json({
            text
        })

    } catch (err) {
        console.error("SERVER CRASH:", err)

        return res.status(500).json({
            error: "Server crashed"
        })
    }
}