export const config = {
    runtime: "nodejs"
}

const CORE_RULES = `
Write in second person using "you" only occasionally.

Do NOT:
- explain behaviour
- analyse behaviour
- interpret motives
- diagnose
- mention disorders
- mention symptoms
- use therapeutic language
- use self-help language
- reassure
- motivate
- moralise
- sound compassionate
- sound inspirational
- sound poetic
- sound literary

Do NOT write:
- cinematic descriptions
- sensory imagery
- body-language narration
- decorative prose
- fictional scenes
- metaphors
- symbolic imagery

Avoid repeatedly describing:
- hands
- eyes
- fingers
- posture
- glances
- staring
- hovering
- dramatic pauses

Avoid abstract behavioural language like:
- task engagement
- behavioural inconsistency
- momentum disruption
- attention regulation
- cognitive patterns
- follow-through difficulties

Prefer:
- short direct observations
- plain behavioural language
- interruption patterns
- unfinished actions
- stalled momentum
- repeated restarting
- drifting attention
- friction between intention and action

The writing must:
- stay behaviourally precise
- stay psychologically recognisable
- stay compressed
- stay modern
- stay concrete
- sound direct and observant

Write shorter sentences.

Avoid repetition between paragraphs.

Do NOT begin consecutive paragraphs with:
- You
- Tasks
- Attention
- Momentum

Avoid repeating sentence openings.

Vary sentence rhythm:
- some short
- some medium-length
- occasional abrupt behavioural conclusions

Use markdown bold VERY SPARSELY.

Example:
**interrupted effort**

Rules:
- maximum 1-2 bold phrases per paragraph
- short phrases only
- never entire sentences
- never motivational wording

Do not write like a therapist.
Do not write like an article.
Do not write like fiction.

Write like blunt behavioural recognition.
`

const MODE_PROMPTS = {

    tldr: `
${CORE_RULES}

Goal:
Write a compressed behavioural recognition summary.

Length:
Maximum 4 bullet points.

Formatting:
- use bullet points only
- one sentence per bullet
- keep bullets visually short
- at least one bullet should be very short
- final bullet should land sharply

Rules:
- avoid repeated openings
- avoid repeated cadence
- avoid abstraction
- avoid behavioural jargon
- avoid filler wording
- avoid scene-setting
- avoid descriptive storytelling

Focus on:
- broken continuity
- fragmented effort
- unstable momentum
- repeated restarting
- partial engagement
- attention drift
- inconsistent completion

This should feel:
- sharp
- compressed
- recognisable
- direct

Tone:
measured
unsentimental
`,

    overview: `
${CORE_RULES}

Goal:
Describe how these patterns appear behaviourally in ordinary life.

Write 4 paragraphs only.

Each paragraph must describe:
- a DIFFERENT behavioural pattern
- a DIFFERENT interruption style
- a DIFFERENT form of inconsistency

Focus on:
- abandoning actions midway
- switching too early
- hovering around tasks without progressing
- repeatedly resetting momentum
- drifting into low-priority activity

Avoid:
- repeated "you start tasks" phrasing
- repeated mention of distraction
- repetitive paragraph openings

This section should feel:
- observational
- exposing
- behaviourally specific
`,

    functioning: `
${CORE_RULES}

Goal:
Show the practical cumulative effect on daily functioning.

Write 4 paragraphs only.

Focus on:
- backlog accumulation
- unanswered communication
- unfinished admin
- inconsistent routines
- time loss
- forgotten obligations
- fragmented energy
- remaining busy without meaningful advancement

This section must focus on consequences rather than behaviour itself.

Avoid:
- repeating overview patterns
- fictional scenes
- repetitive sentence openings

This section should feel:
- practical
- familiar
- quietly exhausting
`,

    patterns: `
${CORE_RULES}

Goal:
Show the contradictions created by these behavioural cycles.

Write 3 shorter paragraphs only.

Focus on contradictions like:
- pressure creates movement but destabilises consistency
- avoidance reduces strain while increasing future pressure
- urgency creates action without continuity
- restarting creates the feeling of effort without closure
- activity disguises lack of sustained progress

Avoid:
- behavioural storytelling
- repetitive openings
- repetitive cadence

Do not resolve the contradictions.

Tone:
measured
direct
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
                temperature: 0.5,
                max_tokens: 450,
                messages: [
                    {
                        role: "system",
                        content: prompt
                    },
                    {
                        role: "user",
                        content: `Behavioural profile:\n${profile}`
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
                "Recognition alone rarely interrupts these cycles.\n\n**Repeated restarting** and unstable momentum usually continue automatically unless behaviour itself changes.\n\nThe MindWorks programme focuses on continuity, sustained attention, behavioural observation, and reducing interruption patterns in real time."

        })

    } catch (err) {

        console.error("SERVER CRASH:", err)

        return res.status(500).json({
            error: "Server crashed"
        })

    }
}