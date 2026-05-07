export const config = {
    runtime: "nodejs"
}

const CORE_RULES = `
Write in second person using "you".

Do NOT:
- explain behaviour
- analyse behaviour
- interpret motives
- diagnose
- mention disorders
- use therapeutic language
- use self-help language
- reassure
- motivate
- moralise
- summarise patterns abstractly

Avoid words and phrases like:
- executive dysfunction
- dopamine
- coping mechanism
- nervous system
- trauma response
- dysregulation
- attention span
- productivity
- overwhelmed
- emotional regulation

Focus only on:
- observable behaviour
- physical actions
- interrupted momentum
- drifting attention
- unfinished sequences
- partial engagement
- restarting
- hesitation
- friction between intention and action

The writing must:
- stay concrete
- unfold moment by moment
- show behavioural sequences
- feel psychologically recognisable
- feel slightly uncomfortable in its accuracy

Do not write like a therapist.
Do not write like an article.
Write like direct observation.

Avoid repetitive paragraph openings.
Avoid symmetrical structure.
`

const MODE_PROMPTS = {
    overview: `
${CORE_RULES}

You are generating a behavioural reflection.

Goal:
Describe exactly what happens when this pattern operates in real life.

Write 5 short paragraphs.

Each paragraph must:
- show a NEW behavioural sequence
- contain movement or transition
- stay behaviourally specific

Include:
- starting with intention but not sustaining
- attention drifting before full awareness
- repeated attempts to re-engage
- effort that does not accumulate
- physical signs of restlessness
- unfinished actions
- staying near the task without fully entering it

Important:
The person intends to continue,
but their behaviour repeatedly separates from that intention.

Tone:
direct
observational
unsentimental
quietly exposing
`,

    functioning: `
${CORE_RULES}

You are generating a daily functioning reflection.

Goal:
Show how this pattern affects ordinary daily life over time.

Write 5 short paragraphs.

Focus on:
- repeatedly restarting tasks
- losing continuity during simple activities
- unfinished responsibilities
- time passing without meaningful completion
- effort producing little visible progress
- constant re-entry into the same task
- inconsistency that creates backlog

Include:
- checking things repeatedly
- moving between tasks without finishing
- mental drifting during ordinary responsibilities
- exhaustion from trying to regain focus

Important:
The person is active much of the day,
yet still ends the day feeling behind.

Tone:
plain
behavioural
clinical
fatiguing
`,

    patterns: `
${CORE_RULES}

You are generating a patterns and trade-offs reflection.

Goal:
Show the internal contradictions created by this behavioural pattern.

Write 5 short paragraphs.

Each paragraph must show:
- a behaviour
- the short-term benefit
- the long-term cost

Include contradictions like:
- pressure creates movement, but destroys consistency
- avoidance reduces strain, but increases unfinished tasks
- bursts of energy create output, but not stability
- disengagement creates relief, but also backlog
- urgency creates action, but not continuity

Important:
Do not resolve the contradiction.
Do not end positively.
Make it clear the pattern keeps repeating.

Tone:
measured
direct
behavioural
exposing without exaggeration
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
                        temperature: 0.55,
                        top_p: 0.9,
                        frequency_penalty: 0.3,
                        presence_penalty: 0.2,
                        max_tokens: 850,
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