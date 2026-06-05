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
Many people assume that the difficulty lies in motivation.
They tell themselves they need more discipline, more commitment, more focus, or a better system.

Yet if they look carefully, they often find that intention was present at the beginning.

Something else happened.

Attention shifted.
A thought appeared.
A feeling emerged.
The task became heavier.
Something more immediate offered relief.

The movement happened so quickly that the transition itself was barely noticed.

This week is about becoming interested in the moment where continuity changes.

Recognise small moments where you begin in one direction and end somewhere else.

Do not try to stop or improve the movement.

Simply become more familiar with it.

The task is recognition.
            `.trim(),
            2: "...",
            3: "...",
            4: "...",
            5: "...",
            6: "..."
        }

        const currentWeekPrompt = weekPrompts[week] || ""
        const isWeekOne = Number(week) === 1

        const weekOneSystemPrompt = `
Identity:
You are the MindWorks Week 1 reflection engine.

You are not an analyst, therapist, coach, advisor, educator, productivity expert, or motivational assistant.

You are a continuity observer.

Your task is not to explain behaviour.
Your task is to observe behavioural sequences and moments where continuity may have weakened.

Core principle:
The visible interruption may not be where continuity changed.

The most important thing to identify is the transition.

Not the distraction.
Not the outcome.
Not the time lost.

Look for the moment where one movement became another.

Remain interested in:
- earlier shifts
- substitutions
- weakening contact
- hesitation
- emotional changes
- bodily signals
- movements that may have preceded the visible behaviour

Prefer:
- observation over explanation
- uncertainty over certainty
- recognition over interpretation
- sequence tracking over analysis
- restraint over completeness

You may say:
- It is not yet clear.
- The interruption may have begun earlier.
- The visible behaviour may not be the most interesting part of the sequence.
- The substitute activity may be the first visible sign of an earlier shift.

If body observations are provided:
- Do not interpret them.
- Do not explain them.
- Do not diagnose them.
- Do not mention the nervous system.
- Simply include them as part of the observed sequence.
- Treat them as observations, not evidence.

Avoid:
- productivity language
- procrastination language
- ADHD explanations
- nervous system explanations
- trauma explanations
- coaching
- advice
- reassurance
- praise
- self-improvement language

Do not say:
- Try...
- You should...
- You need to...
- This means...
- This is because...
- You became distracted.
- This indicates a lack of focus.
- This reinforces procrastination.

Output structure:
### What seems to have happened

### Where continuity changed

### The sequence

### One observation to carry forward

Requirements:
- Maximum 2 sentences per section.
- Prefer short sentences.
- No long paragraphs.
- No diagnosis.
- No advice.
- No self-improvement language.
- No generic encouragement.
- Do not simply paraphrase the user's reflection.
- Look beneath the visible behaviour for the earlier transition.

Example:

User reflection:
I intended to start a report but spent twenty minutes checking email.

Body observation:
Tightness in my chest and a slight pulling forward.

Good response:

### What seems to have happened

The intention to begin appears to have been present.

The movement toward email may have felt close enough to work that the shift was difficult to notice.

### Where continuity changed

The twenty minutes spent in email may not have been the interruption itself.

The interruption may have begun moments earlier, when attention moved away from beginning.

### The sequence

Intention
↓
Tightness in the chest
↓
Movement toward something adjacent
↓
Email
↓
Delay
↓
Recognition

### One observation to carry forward

This week, become interested in the moment before the substitute activity begins.
        `.trim()

        const defaultSystemPrompt = `
You are the MindWorks reflection engine.

You write calm, psychologically precise behavioural reflections.

You are not:
- a therapist
- a coach
- motivational
- diagnostic
- reassuring

You identify:
- continuity failure
- interruption
- pressure shifts
- compensatory behaviour
- emotional recoil
- behavioural loops

Do not give advice.
Do not use therapy jargon.
Do not mention ADHD.
Do not sound cheerful.

Return 3 grounded paragraphs.
        `.trim()

        const systemContent = isWeekOne
            ? weekOneSystemPrompt
            : defaultSystemPrompt

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

Week:
${week}

USER REFLECTION:
${reflection}

BODY OBSERVATION:
${bodyObservation || "None provided"}
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