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

Focus only on:
- observable behaviour
- interrupted momentum
- unfinished actions
- drifting attention
- restarting
- hesitation
- friction between intention and action

The writing must:
- stay concrete
- unfold moment by moment
- feel psychologically recognisable
- feel behaviourally precise

Do not write like a therapist.
Do not write like an article.
Write like direct observation.
`

const MODE_PROMPTS = {
    tldr: `
${CORE_RULES}

Goal:
Write a short behavioural summary.

Write 1 paragraph only.

Focus on:
- effort without continuity
- repeated restarting
- drifting attention
- unfinished momentum

Tone:
clinical
direct
recognisable
`,

    overview: `
${CORE_RULES}

Goal:
Describe how these patterns appear in real life.

Write 5 short paragraphs.

Include:
- intention without sustained follow-through
- drifting attention
- unfinished actions
- physical restlessness
- partial engagement

Tone:
direct
observational
quietly exposing
`,

    functioning: `
${CORE_RULES}

Goal:
Show the effect on ordinary daily functioning.

Write 5 short paragraphs.

Focus on:
- unfinished responsibilities
- losing continuity
- mental fatigue
- restarting tasks
- effort not accumulating

Tone:
plain
clinical
fatiguing
`,

    patterns: `
${CORE_RULES}

Goal:
Show the contradictions created by these patterns.

Write 5 short paragraphs.

Include:
- pressure creates movement but destroys consistency
- avoidance reduces strain but increases backlog
- bursts of effort without stability
- repeated behavioural cycles

Do not resolve the contradictions.

Tone:
measured
behavioural
unsentimental
`
}

function sanitizeProfile(profile) {
    try {
        const json = JSON.stringify(profile)

        if (json.length > 12000) {
            return json.slice(0, 12000)
        }

        return json
    } catch {
        return ""
    }
}

async function generateSection(prompt, profile, apiKey) {
    const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4.1-mini",
                temperature: 0.55,
                max_tokens: 700,
                messages: [
                    {
                        role: "system",
                        content: prompt
                    },
                    {
                        role: "user",
                        content: `Profile:\n${profile}`
                    }
                ]
            })
        }
    )

    const data = await response.json()

    return data?.choices?.[0]?.message?.content?.trim() || ""
}

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({
                error: "Method not allowed"
            })
        }

        const { profile } = req.body || {}

        if (!profile) {
            return res.status(400).json({
                error: "Missing profile"
            })
        }

        const serializedProfile = sanitizeProfile(profile)

        const apiKey = process.env.OPENAI_API_KEY

        const [
            tldr,
            overview,
            functioning,
            patterns
        ] = await Promise.all([
            generateSection(
                MODE_PROMPTS.tldr,
                serializedProfile,
                apiKey
            ),
            generateSection(
                MODE_PROMPTS.overview,
                serializedProfile,
                apiKey
            ),
            generateSection(
                MODE_PROMPTS.functioning,
                serializedProfile,
                apiKey
            ),
            generateSection(
                MODE_PROMPTS.patterns,
                serializedProfile,
                apiKey
            )
        ])

        return res.status(200).json({
            tldr,
            overview,
            functioning,
            patterns,
            closing:
                "These patterns often persist because they temporarily reduce pressure, even while creating longer-term instability and repeated friction with ordinary responsibilities.\n\nRecognition alone rarely changes the cycle.\n\nThe MindWorks 6-Week Programme is designed to help you work with these patterns more directly through structured behavioural observation, sustained attention practice, and guided exercises focused on continuity rather than motivation."
        })

    } catch (err) {
        console.error("SERVER CRASH:", err)

        return res.status(500).json({
            error: "Server crashed"
        })
    }
}