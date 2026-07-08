import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)
export const config = {
    runtime: "nodejs"
}

const CORE_RULES = `
Write in second person using "you" only occasionally.

Do NOT:
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
- explain motives
- invent causes
- use ADHD language
- use trauma language
- use executive dysfunction language
- use attachment language
- use analytical prose
- infer hidden mental processes
- explain psychology
- classify the user

Do NOT write:
- cinematic descriptions
- fictional scenes
- sensory imagery
- decorative prose
- metaphors
- symbolic imagery

Do NOT use:
- attention can shift away
- progression through a task
- partial engagement
- competing impulses
- effort feels fragmented
- lacks consistency or depth
- interrupted continuity
- difficult to advance beyond initial stages
- increasing the time required
- superficial
- objective
- execution
- cognitive
- behavioural pattern

Prefer:
- plain behavioural observation
- concrete wording
- short sentences
- direct recognition
- practical consequences
- measured specificity
- investigation-oriented language (e.g., "appears", "seems", "worth exploring", "could indicate", "may", "could be worth looking at")
- plain language like: "something changed", "the task lost direction", "returning felt harder", "restarting took longer", "progress paused", "the task stayed unfinished", "this may be worth looking at"

Avoid:
- generic ADHD language
- repetitive cadence
- repetitive openings
- abstraction
- personality typing
- diagnostic framing
- making confident claims or labels (e.g., never say "You are...", "You have...", "This means...")

Keep sentences compressed.

Write like direct behavioural recognition and an investigation starter.
`

const INVESTIGATION_RULES = `
Goal: Describe one possible place to begin an investigation based on recurring patterns and transitions.

The writing should create the response: "I knew those things happened... I never realised they might be connected."

Structure (Strictly follow this):

1. Section heading (Exactly):
A possible starting point

2. Body copy:
Several of your answers point towards situations where [plain-language pattern] is followed by a change in what happens next.

That doesn’t necessarily mean [plain-language pattern] is the cause.

It simply makes it a useful place to start looking.

3. Section heading (Exactly):
You mentioned experiences like:

4. Bullet list:
Show exactly 4 short bullet observations based on selected quiz answers.

Example observations:
* Something interrupted what you were doing.
* Your attention shifted before the task was finished.
* Getting back into the task felt harder than expected.
* The task remained unfinished longer than you expected.

Keep each observation to a single short concrete sentence.

5. Body copy:
These experiences may be related.

Or they may be completely separate.

The only way to know is to compare them with real examples.

6. Section heading (Exactly):
Your first investigation

7. Body copy:
Think about the most recent time this happened.

Not the biggest example.

Just the most recent one.

Then answer:

8. Prompt list (Exactly):
* What were you doing?
* What interrupted it?
* What happened immediately afterwards?
* Did you return to the task? If so, when?

9. Closing line (Exactly):
One recent example is enough to begin the investigation.

10. Optional Enhancement - One possible sequence:
If the selected answers support it, generate a simple investigation sequence instead of only showing observations.

Example:
One possible sequence
Something became important
↓
Progress slowed
↓
An interruption happened
↓
Returning became harder
↓
The task stayed unfinished

This sequence should only use recognised situations from the user's answers.
Do not generate psychological explanations.
`

const LOW_SIGNAL_RULES = `
This profile shows minimal behavioural endorsement.

This is NOT a mild dysfunction profile.

Treat it as absence of a strong continuity-disruption signal.

Do NOT describe:
- repeated restarting
- fragmented momentum
- stalled progression
- unfinished carryover
- unstable follow-through
- backlog accumulation
- pressure dependence
- task collapse
- persistent interruption
- cumulative exhaustion

Prefer:
- stable continuity
- ordinary variation
- low behavioural signal
- limited interruption
- adequate follow-through
- no strong pattern emerging
- little evidence of recurring disruption

The writing should feel sparse, restrained, and low-intensity.
`

function sanitiseProfile(profile) {

    try {

        const json = JSON.stringify(profile)

        if (json.length > 30000) {
            return json.slice(0, 30000)
        }

        return json

    } catch {

        return ""

    }

}

function isLowSignalProfile(profile) {

    return Boolean(
        profile?.veryLowSignal ||
        profile?.responseStyle === "minimal_endorsement"
    )

}

function buildSystemPrompt(section, profile) {

    const lowSignal =
        isLowSignalProfile(profile)

    if (lowSignal) {

        const lowSignalPrompts = {

            tldr: `
${CORE_RULES}

${LOW_SIGNAL_RULES}

${INVESTIGATION_RULES}

Goal:
Write compressed low-signal behavioural recognition.

Focus on:
- no dominant interruption pattern
- stable or adequate continuity
- low endorsement
- limited evidence of recurring disruption

Do not turn absence into mild dysfunction.
`,

            overview: `
${CORE_RULES}

${LOW_SIGNAL_RULES}

${INVESTIGATION_RULES}

Goal:
Describe the absence of a strong continuity-disruption pattern.

Focus on:
- low behavioural signal
- stable or adequate continuity
- limited interruption
- no consolidated pattern

Do NOT describe continuity as repeatedly breaking.

This section should feel like:
- low intensity
- restrained
- accurate to minimal endorsement
- non-pathologising
`,

            functioning: `
${CORE_RULES}

${LOW_SIGNAL_RULES}

${INVESTIGATION_RULES}

Goal:
Describe daily functioning where no strong disruption pattern emerged.

Focus on:
- responsibilities not showing strong disruption
- limited carryover
- ordinary interruptions resolving adequately
- no clear accumulation pattern
- no strong evidence of repeated functional cost

Do NOT describe backlog, exhaustion, or collapse unless strongly supported.
`,

            patterns: `
${CORE_RULES}

${LOW_SIGNAL_RULES}

${INVESTIGATION_RULES}

Goal:
Describe the lack of a strong contradiction pattern.

Focus on:
- no clear pressure-dependence loop
- no strong restart cycle
- no consolidated drift pattern
- no dominant behavioural contradiction

Do not resolve anything.
Do not create a problem where the profile does not support one.
`

        }

        return lowSignalPrompts[section]

    }

    const prompts = {

        tldr: `
${CORE_RULES}

${INVESTIGATION_RULES}

Goal:
Write the complete investigation starter report following the structure in INVESTIGATION_RULES.
`,

        overview: `
${CORE_RULES}

${INVESTIGATION_RULES}

Goal:
Write the complete investigation starter report following the structure in INVESTIGATION_RULES.
`,

        functioning: `
${CORE_RULES}

${INVESTIGATION_RULES}

Goal:
Write the complete investigation starter report following the structure in INVESTIGATION_RULES.
`,

        patterns: `
${CORE_RULES}

${INVESTIGATION_RULES}

Goal:
Write the complete investigation starter report following the structure in INVESTIGATION_RULES.
`

    }

    return prompts[section]

}

function buildProfileContext(profile) {

    const profiles =
        profile.profiles || []

    const contradictions =
        profile.contradictions || []

    const topTraits =
        profile.topTraits || []

    const behaviouralSummary =
        profile.behaviouralSummary || {}

    return `
PROFILE SIGNALS

Response style:
${profile.responseStyle || "unknown"}

Low signal:
${profile.lowSignal ? "true" : "false"}

Very low signal:
${profile.veryLowSignal ? "true" : "false"}

Total signal strength:
${profile.totalSignalStrength || 0}

Dominant pattern:
${profile.dominantPattern || "unknown"}

Profiles:
${JSON.stringify(profiles, null, 2)}

Top behavioural traits:
${JSON.stringify(topTraits, null, 2)}

Contradictions:
${JSON.stringify(contradictions, null, 2)}

Behavioural summary:
${JSON.stringify(behaviouralSummary, null, 2)}
`

}

function buildConditionalInstructions(profile) {

    const instructions = []

    if (isLowSignalProfile(profile)) {

        instructions.push(`
HARD ROUTING:
This is a low-signal report.

You must describe the ABSENCE of a strong pattern.

Do NOT write a softened version of the high-signal report.

Do NOT use:
- "drifts"
- "stalls"
- "fragments"
- "restarts"
- "unfinished"
- "breaks down"
- "loses continuity"
- "pressure creates movement"
unless clearly framed as not strongly present.

The output should make clear that no dominant continuity instability emerged.
`)

        return instructions.join("\n\n")

    }

    if (
        profile.responseStyle ===
        "mixed_inconsistency"
    ) {

        instructions.push(`
The profile contains mixed endorsement patterns.

Focus on:
- inconsistency
- fluctuation
- intermittent continuity breakdown
- unstable follow-through
- variable engagement
`)
    }

    if (
        profile.responseStyle ===
        "high_pattern_recognition"
    ) {

        instructions.push(`
The profile shows strong pattern endorsement.

You may:
- describe more consolidated behavioural loops
- describe stronger continuity instability
- describe stronger cumulative consequences

Still avoid diagnosis language.
`)
    }

    if (
        profile.profiles?.some(
            p =>
                p.key ===
                "pressure_sustained_functioning"
        )
    ) {

        instructions.push(`
Pressure-dependent functioning is strongly present.

Focus on:
- urgency dependence
- delayed activation
- pressure-driven movement
- exhaustion after mobilisation
`)
    }

    if (
        profile.profiles?.some(
            p =>
                p.key ===
                "fragmented_completion"
        )
    ) {

        instructions.push(`
Fragmented completion patterns are strongly present.

Focus on:
- unfinished progression
- repeated reopening
- stalled completion
- lingering mental carryover
`)
    }

    if (
        profile.profiles?.some(
            p =>
                p.key ===
                "internally_accelerated_functioning"
        )
    ) {

        instructions.push(`
Internal acceleration is strongly present.

Focus on:
- inability to settle fully
- ongoing internal movement
- reduced recovery
- difficulty sustaining stillness
`)
    }

    return instructions.join("\n\n")

}

function buildUserInstruction(profile) {

    if (isLowSignalProfile(profile)) {

        return `
${buildProfileContext(profile)}

IMPORTANT:

This is a minimal endorsement profile.

Only describe what the profile supports:
- no strong continuity failure
- no strong interruption loop
- no strong restart cycle
- no strong pressure-dependence pattern
- no strong functional accumulation pattern

Do NOT infer hidden dysfunction.

Do NOT make the report sound like mild ADHD.

Do NOT create a behavioural problem just because this is a quiz.

The correct output should feel materially different from a high-signal report.
`

    }

    return `
${buildProfileContext(profile)}

IMPORTANT:

Only describe patterns strongly supported by the profile.

Do NOT:
- invent instability
- exaggerate dysfunction
- describe traits absent from the profile
- collapse all users into the same behavioural narrative

Prioritise:
- strongest behavioural mechanisms
- contradiction density
- continuity instability
- restart behaviour
- interruption patterns
- pressure dependence
- fragmentation
- behavioural carryover
`

}

async function generateSection(
    section,
    profile,
    apiKey
) {

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

                temperature:
                    isLowSignalProfile(profile) ? 0.35 : 0.75,

                max_tokens:
                    isLowSignalProfile(profile) ? 450 : 700,

                messages: [

                    {
                        role: "system",
                        content:
                            buildSystemPrompt(
                                section,
                                profile
                            )
                    },

                    {
                        role: "system",
                        content:
                            buildConditionalInstructions(profile)
                    },

                    {
                        role: "user",
                        content:
                            buildUserInstruction(profile)
                    }

                ]

            })
        }
    )

    if (!response.ok) {

        const text =
            await response.text()

        console.error(
            "OPENAI ERROR:",
            text
        )

        throw new Error(text)

    }

    const data =
        await response.json()

    return (
        data?.choices?.[0]?.message?.content?.trim() ||
        ""
    )

}

function buildClosing(profile) {

    if (isLowSignalProfile(profile)) {

        return "This reflection did not identify a strong continuity-disruption pattern.\n\nThe MindWorks programme is designed for people who recognise recurring interruption, restart cycles, or unstable follow-through strongly enough to observe them in real time."

    }

    return "Recognition alone rarely interrupts these cycles.\n\nStable continuity usually requires repeated behavioural observation in real time.\n\nThe MindWorks programme focuses on continuity, interruption patterns, sustained attention, and reducing automatic behavioural drift."

}

export default async function handler(
    req,
    res
) {

    try {

        if (req.method !== "POST") {

            return res.status(405).json({
                error: "Method not allowed"
            })

        }

        const apiKey =
            process.env.OPENAI_API_KEY

        if (!apiKey) {

            return res.status(500).json({
                error: "Missing OpenAI API key"
            })

        }

        const {
            profile,
            userId,
            email
        } = req.body || {}
        console.log("QUIZ USER ID:", userId)

        if (!profile) {

            return res.status(400).json({
                error: "Missing profile"
            })

        }

        const serialisedProfile =
            sanitiseProfile(profile)

        const parsedProfile =
            JSON.parse(serialisedProfile)

        const [
            tldr,
            overview,
            functioning,
            patterns
        ] = await Promise.all([

            generateSection(
                "tldr",
                parsedProfile,
                apiKey
            ),

            generateSection(
                "overview",
                parsedProfile,
                apiKey
            ),

            generateSection(
                "functioning",
                parsedProfile,
                apiKey
            ),

            generateSection(
                "patterns",
                parsedProfile,
                apiKey
            )

        ])

        console.log("EMAIL RECEIVED:", email)

        if (email) {

            const normalisedEmail =
                String(email)
                    .trim()
                    .toLowerCase()

            console.log("NORMALISED EMAIL:", normalisedEmail)

            const { error } = await supabase
                .from("quiz_submissions")
                .upsert(
                    {
                        email: normalisedEmail,
                        profile_data: parsedProfile,
                        user_id: userId || null
                    },
                    {
                        onConflict: "email"
                    }
                )

            console.log("UPSERT ERROR:", error)

            if (error) {

                console.error(
                    "QUIZ SUBMISSION SAVE ERROR:",
                    error
                )

                return res.status(500).json({
                    error: "Failed to save quiz submission"
                })

            }

        }

        return res.status(200).json({

            tldr,
            overview,
            functioning,
            patterns,

            closing:
                buildClosing(parsedProfile)

        })

    } catch (err) {

        console.error(
            "REPORT GENERATION ERROR:",
            err
        )

        return res.status(500).json({
            error:
                "Failed to generate reflection"
        })

    }

}