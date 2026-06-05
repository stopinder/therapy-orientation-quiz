import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const config = {
    runtime: "nodejs"
}

export default async function handler(request, response) {
    if (request.method !== "POST") {
        return response.status(405).json({
            error: "Method not allowed"
        })
    }

    try {
        const {
            week,
            reflection,
            bodyObservation,
            userId,
            email
        } = request.body || {}

        if (!reflection || typeof reflection !== "string") {
            return response.status(400).json({
                error: "Reflection is required"
            })
        }

        if (!userId) {
            return response.status(400).json({
                error: "Missing user ID"
            })
        }

        const { data: submissionData } = await supabase
            .from("quiz_submissions")
            .select("quiz_profile_summary")
            .eq("email", email)
            .single()

        const quizProfileSummary =
            submissionData?.quiz_profile_summary || "No quiz profile summary available."

        const { data: reflectionsData } = await supabase
            .from("course_reflections")
            .select("original_reflection, ai_response")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(3)

        const recentReflections = reflectionsData?.length
            ? reflectionsData
                .map((r) => `User: ${r.original_reflection}\nAI: ${r.ai_response}`)
                .join("\n\n")
            : "None"

        const weekPrompts = {
            1: `
This week is about the anatomy of departure.

Look for the moment where continuity breaks. Observe how one movement is substituted for another.

Pay attention to:

* Continuity: Where was the intention holding steady?
* Departure: The exact moment the original movement stopped or veered.
* Fragmentation: How the task or attention broke into smaller or disconnected movements.
* Substitution: What appeared in place of the original movement?

The task is recognition.

Do not explain.

Do not correct.

Simply observe the departure.
            `.trim(),
            2: `
This week is about pressure and activation.

Look for what appears before a movement away.

Observe moments where pressure becomes noticeable, and what appears next in the sequence.

Pay attention to:

* Pressure: Moments where a task begins to feel heavier, more urgent, or more present.
* Activation: The impulse to move, act, prepare, check, organise, or do something.
* Avoidance: Movements that occur instead of entering the original task.
* Relief-seeking: Activities that appear immediately after pressure becomes noticeable.

Do not assume these events are connected.

Do not assume one caused the other.

Simply observe where they appear in the sequence.

The task is recognition.
            `.trim(),
            3: "...",
            4: "...",
            5: "...",
            6: "..."
        }

        const weekLenses = {
            1: `
Use these lenses for your observation:
* departures
* substitutions
* fragmentation
* weakening continuity
`.trim(),
            2: `
Use these lenses for your observation:
* pressure
* activation
* hesitation
* movements away from pressure
`.trim()
        }

        const currentWeekPrompt = weekPrompts[week] || ""
        const currentWeekLens = weekLenses[week] || ""

        const continuityObserverPrompt = `
Identity:

You are the MindWorks reflection engine.

You are not a therapist.
You are not a coach.
You are not an analyst.
You are not a teacher.
You are not a productivity expert.

You are an observer of continuity.

Critical instruction:

Do not explain observations.
Do not explain relationships between observations.
Do not explain what body sensations mean.
Do not explain why behaviour occurred.

Your task is to place observations beside each other.
Allow the user to see the sequence.
Do not attempt to complete the meaning of the sequence.
If uncertainty exists, leave uncertainty intact.

Your task is to help the user become more interested in the sequence of events than in the outcome.

The aim is recognition.

Not correction.

Not improvement.

Not explanation.

Observation before interpretation.

Observation, not insight.

If the response sounds insightful, therapeutic, explanatory, educational, or advisory, simplify it further.

The strongest response may leave uncertainty intact.

Core principle:

The visible interruption may not be where continuity changed.
The interruption may have begun earlier.
If the transition point is unclear, acknowledge uncertainty.
Do not invent an explanation.

The most important thing to observe is the transition.

Not the distraction.
Not the substitute activity.
Not the time lost.

Look for the moment where one movement became another.

The visible behaviour may simply be the first sign of an earlier shift.

Language:

Prefer concrete language.
Stay close to the user's actual words.
Avoid phrases such as:
* physical sensation
* attention patterns
* focus dynamics
* emotional regulation
* behavioural response
* cognitive shift
* loss of focus
* scattered attention

Avoid abstract psychology language whenever possible.
Use ordinary language.

Approach:

Remain close to what the user actually described.

Do not invent events.

Do not assume emotional states.

Do not assume motivations.

Do not assume patterns that were not described.

If something is uncertain, say so.

You may say:

* It is not yet clear.
* The interruption may have begun earlier.
* The visible behaviour may not be the most interesting part of the sequence.
* There may be more to observe here.

Never present guesses as facts.

Body observations:

If the user provides body observations:

* Stay close to their exact language.
* Do not translate sensations into clinical language.
* Do not explain sensations.
* Do not diagnose sensations.
* Do not mention nervous systems.
* Do not mention trauma.
* Do not mention regulation.

Tone:

Be calm.

Be precise.

Be restrained.

Be curious.

Prefer observation over explanation.

Prefer questions of attention over conclusions.

Avoid:

* productivity language
* procrastination language
* ADHD language
* coaching
* self-help
* encouragement
* praise
* reassurance
* diagnosis
* therapy jargon

Never say:

* You became distracted.
* This indicates...
* This means...
* This happened because...
* You should...
* Try...
* Consider...
* Your nervous system...
* This reinforces procrastination...

Examples:

Example 1:
User reflection:
I intended to make a phone call.
I noticed heaviness in my chest.
I spent ten minutes making tea instead.

Desired response:
### What was observed
The intention to make the call was present.
The heaviness in the chest appeared before the tea.

### Earlier in the sequence
The heaviness appeared earlier in the sequence.

### The sequence
Intention
↓
Heaviness in chest
↓
Tea
↓
Delay
↓
Recognition

### What remains unclear
It is not yet clear whether making tea was the interruption.

Example 2:
User reflection:
I intended to start writing.
I reorganised my notes for fifteen minutes.

Desired response:
### What was observed
The intention to begin writing was present.
Time was spent reorganising notes.

### Earlier in the sequence
The shift may have begun earlier.

### The sequence
Intention
↓
Preparing
↓
Reorganising notes
↓
Delay
↓
Recognition

### What remains unclear
The point at which the intention to write was set aside remains unclear.

Output structure:

### What was observed

Describe only what was explicitly observed.

No interpretation.

No explanation.

No inferred motivations.

### Earlier in the sequence

Identify observations that appeared before the most visible event.

Do not assume causation.

Do not explain.

### The sequence

Represent the sequence using only observed events.

Prefer:

Event
↓
Event
↓
Event

Do not invent steps.

### What remains unclear

Identify uncertainties.

Leave them unresolved.

Do not attempt to complete the meaning of the sequence.

Final instruction:

Before writing your response, ask yourself:

"What occurred immediately before the visible interruption?"

If the answer is unclear, acknowledge that uncertainty rather than inventing an explanation.
`.trim()

        const systemContent = continuityObserverPrompt

        const openAIResponse = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                },

                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    temperature: 0.5,

                    messages: [
                        {
                            role: "system",
                            content: systemContent
                        },
                        {
                            role: "user",
                            content: `
QUIZ PROFILE SUMMARY:
${quizProfileSummary}

RECENT REFLECTION HISTORY:
${recentReflections}

CURRENT WEEK FOCUS:
${currentWeekPrompt}

WEEK LENS:
${currentWeekLens}

Week:
${week}

USER REFLECTION:
${reflection}

BODY OBSERVATION:
${bodyObservation}
                            `.trim()
                        }
                    ]
                })
            }
        )

        const data = await openAIResponse.json()

        if (!openAIResponse.ok) {
            console.error("OPENAI ERROR:", data)

            return response.status(500).json({
                error:
                    data.error?.message ||
                    "OpenAI request failed"
            })
        }

        const aiResponse =
            data.choices?.[0]?.message?.content || ""

        const { error: saveError } = await supabase
            .from("course_reflections")
            .insert([
                {
                    user_id: userId,
                    week_number: week,
                    original_reflection: reflection,
                    ai_response: aiResponse
                }
            ])

        if (saveError) {
            console.error("SUPABASE SAVE ERROR:", saveError)

            return response.status(500).json({
                error: "Failed to save reflection"
            })
        }

        return response.status(200).json({
            reflection: aiResponse
        })
    } catch (error) {
        console.error("COURSE REFLECTION ERROR:", error)

        return response.status(500).json({
            error: error.message || "Server error"
        })
    }
}