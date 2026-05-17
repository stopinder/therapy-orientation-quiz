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
- feet
- posture
- glances
- hovering
- staring
- pausing dramatically

Focus only on:
- observable behaviour
- interrupted momentum
- unfinished actions
- drifting attention
- restarting
- hesitation
- friction between intention and action
- behavioural inconsistency
- avoidance loops
- partial task engagement
- repeated re-entry into tasks

The writing must:
- stay behaviourally precise
- stay psychologically recognisable
- stay compressed
- stay modern
- stay concrete
- sound direct and observant

Write shorter sentences.

Avoid repetition between paragraphs.

Each paragraph must introduce a NEW behavioural pattern.

Do not repeat the same behavioural example using different objects.

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
6-10 sentences maximum.

Rules:
- no decorative writing
- no examples involving objects
- no cinematic narration
- no fictional scene-setting

Focus on:
- broken continuity
- repeated restarting
- fragmented effort
- inconsistent follow-through
- attention drift
- partial engagement

Tone:
direct
compressed
recognisable
unsentimental
`,

    overview: `
${CORE_RULES}

Goal:
Describe how these patterns appear behaviourally in ordinary life.

Write 5 short paragraphs.

Each paragraph must describe:
- a DIFFERENT behavioural pattern
- a DIFFERENT type of interruption
- a DIFFERENT form of inconsistency

Good topics:
- switching tasks too early
- remaining near tasks without progressing
- abandoning actions midway
- restarting repeatedly
- losing behavioural continuity
- drifting into low-priority actions

Avoid:
- domestic storytelling
- cinematic detail
- object-heavy examples
- repeated "you start something" structures

Tone:
observational
behavioural
direct
quietly exposing
`,

    functioning: `
${CORE_RULES}

Goal:
Show the cumulative effect on ordinary functioning.

Write 5 short paragraphs.

Focus on:
- backlog accumulation
- delayed responses
- unfinished admin
- forgotten messages
- inconsistent routines
- energy fragmentation
- effort without accumulation
- staying busy without advancing

This section should feel:
- practical
- familiar
- quietly exhausting

Avoid:
- fictional scenes
- physical gesture descriptions
- over-dramatic wording

Tone:
plain
clinical
recognisable
fatiguing
`,

    patterns: `
${CORE_RULES}

Goal:
Show the contradictions created by these patterns.

Write 5 short paragraphs.

Focus on contradictions like:
- pressure creates movement but destroys consistency
- avoidance reduces strain but increases backlog
- urgency produces bursts of action without stability
- restarting creates the feeling of effort without completion
- activity masks lack of sustained progress

Do not resolve the contradictions.

Do not reassure.

Keep paragraphs shorter and sharper than other sections.

Tone:
measured
behavioural
unsentimental
exposing
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
                temperature: 0.4,
                max_tokens: 550,
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
                "Recognition does not automatically interrupt these cycles.\n\nThe pattern often continues through repetition, partial engagement, avoidance, and repeated behavioural restarting.\n\nThe MindWorks programme focuses on continuity, sustained attention, behavioural observation, and reducing interruption patterns in real time."
        })

    } catch (err) {

        console.error("SERVER CRASH:", err)

        return res.status(500).json({
            error: "Server crashed"
        })
    }
}