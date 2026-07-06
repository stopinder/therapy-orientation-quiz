import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const config = {
    runtime: "nodejs"
}

/**
 * MindWorks Continuity Layer v1
 *
 * This endpoint exists to observe recurrence across reflections.
 */
export default async function handler(request, response) {
    if (request.method !== "POST") {
        return response.status(405).json({
            error: "Method not allowed"
        })
    }

    try {
        const { userId, currentStage = 6, isCourseOverview = false } = request.body || {}

        if (!userId) {
            return response.status(400).json({
                error: "Missing user ID"
            })
        }

        // Retrieve last 10 rows from course_reflections
        const { data: reflectionsData, error: dbError } = await supabase
            .from("course_reflections")
            .select("original_reflection, ai_response, week_number, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(10)

        if (dbError) {
            console.error("DATABASE ERROR:", dbError)
            return response.status(500).json({
                error: "Failed to retrieve reflections"
            })
        }

        const count = reflectionsData?.length || 0

        console.log(`REFLECTIONS LOADED: ${count}`)
        if (reflectionsData) {
            reflectionsData.forEach((r, i) => {
                console.log(`REFLECTION ${i}: ${r.original_reflection}`)
            })
        }

        if (count < 2) {
            console.log("CONTINUITY ACCEPTED: false")
            return response.status(200).json({
                summary: `Becoming visible

A clear pattern hasn’t formed yet.

There are moments where the shift happens as you begin.

See if you can notice that moment next time.`
            })
        }

        const recentReflections = reflectionsData
            .map((r, index) => `---
Index: ${index}
Week: ${r.week_number}
Date: ${r.created_at}
Observation: ${r.original_reflection}
MindWorks Observation: ${r.ai_response}`)
            .join("\n\n")

        const systemPrompt = `
You are a Field Researcher documenting recurring behavioural moments across a cumulative investigation. 

Identity:
A quiet observer collecting evidence over time. Your task is to compare every reflection against every other reflection to find behavioural moments that recur. Ignore one-off events. Never describe a behaviour unless it appears in multiple reflections.

Tone: calm, precise, curious, restrained, evidence-led field notes. No causal language (due to, because, caused by). No emotional inference. No context-specific labels (social, work). Keep patterns at structural level. No inferred elements. Short, direct sentences. No narrowing of pattern. No explanation of why. Use simple, everyday phrasing. Avoid clinical or AI-sounding words. MUST use recurrence phrases: "again", "each time", "across different situations", "more than once".

Product Philosophy:
Observation before interpretation. Accumulation before explanation. Progressively discover patterns rather than declare them.

Tone Guidelines:
- Use: beginning to appear, may be, not yet clear, still being observed, not enough evidence yet, start something, gardening, start in the garden.
- Avoid: this means, this indicates, this proves, this shows that, the user is..., engage, initiate, begin activity, doing the garden, starting doing.
- Never diagnose. Never over-interpret. Never sound certain.

CORE ANALYSIS:
1. PRE-PROCESS: For each reflection, extract the task/start context (e.g. "start working", "begin task") and the shift behaviour (e.g. "check phone", "watch football").
2. RELAXED GROUPING: Group similar values instead of requiring exact matches. 
   - Normalise inputs (lower case, remove filler words).
   - Map similar start tasks: "start work", "start admin", "start task", "at my desk" -> "start work".
   - Map similar shift behaviours: "check phone", "check messages", "look at phone", "scroll through phone" -> "check phone".
3. Only select a pattern if it appears more than once (count >= 2).
4. If multiple patterns exist, choose the pair with the highest count.
5. If output could be generated from a single reflection, it is invalid.
6. DO NOT guess or infer. DO NOT use vague phrases like "start something" if a specific task is present.

GENERATION STRUCTURE (MANDATORY):
- Sentence 1: "This keeps happening when you start [start]." (where [start] is the specific task)
- Sentence 2: "You begin [start], then switch to [shift]."
- Sentence 3: "The shift appears just before you fully begin."
- Sentence 4: "See if you can notice that moment next time."

Provide raw fragments for JSON fields:
- pattern_across_time: Sentence 1 as specified.
- intention: raw action (e.g., "cleaning the garden"). NO "plan to".
- shift: raw action taken instead (e.g., "watching football"). NO "instead".
- pointer: Sentence 3 as specified.
- matchingIndices: Array of indices of the reflections that support this specific recurring behavioural moment.

Grammar Rules:
- Sentence 2 must follow: "You begin [task], then switch to [behaviour]."
- Use correct article usage (e.g., "the garden", not just "garden").
- Use natural verb phrasing (e.g., "watching", not "watch").
- Avoid awkward gerund forms (e.g., use "gardening" or "start in the garden" instead of "doing the garden" or "starting doing").
- Ensure 'intention' and 'shift' fragments are natural. 
- Example: intention="gardening", shift="watching football". 
- Resulting Sentence 2: "You begin gardening, then switch to watching football."

Rules for forward attention guidance:
- NO advice or behavioural instruction
- NO "you should", "try", "change"
- NO interpretation
- NO therapy language
- MUST direct attention forward and stay observational

Language and Perspective:
- Use second-person perspective ONLY ("you", "your"). Replace "I", "my", "me" with "you", "your".
- Use consistent PRESENT TENSE.
- Ensure the summary reads naturally as a description of the user's recurring experience.

OUTPUT FORMAT:
Return a JSON object ONLY.

{
  "recurringGroups": [
    {
      "pattern_across_time": "repetition description",
      "intention": "raw intention fragment",
      "shift": "raw shift fragment",
      "pointer": "pointer sentence",
      "matchingIndices": [0, 1, 3]
    }
  ]
}

Rules:
1. Return JSON only.
2. Use "stomach" instead of "tummy".
3. Replace "work or engage in a task" with "start something" ONLY if no specific task is found.
4. Ensure sentences are short and neutral.
5. "recurringGroups" should contain all identified recurring patterns supported by at least two reflections.
6. Strictly follow the Language and Perspective rules.
7. REUSE specific user phrasing for actions.
8. Use present simple for 'intention' (e.g., "clean the garden").
9. Use gerund for 'shift' (e.g., "watching football").
`.trim()
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
                    temperature: 0,
                    response_format: { "type": "json_object" },
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: recentReflections
                        }
                    ]
                })
            }
        )

        const data = await openAIResponse.json()

        if (!openAIResponse.ok) {
            console.error("OPENAI ERROR:", data)
            return response.status(500).json({
                error: data.error?.message || "OpenAI request failed"
            })
        }

        const rawContent = data.choices?.[0]?.message?.content || ""
        let jsonResult = {}
        
        try {
            jsonResult = JSON.parse(rawContent)
        } catch (e) {
            console.error("JSON PARSE ERROR:", e)
            return response.status(200).json({
                summary: `Becoming visible

A clear pattern hasn’t formed yet.

There are moments where the shift happens as you begin.

See if you can notice that moment next time.`
            })
        }

        const recurringGroups = jsonResult.recurringGroups || []
        console.log(`RECURRING GROUPS FOUND BY AI: ${recurringGroups.length}`)
        recurringGroups.forEach((g, i) => {
            console.log(`AI GROUP ${i + 1}: start="${g.intention}", shift="${g.shift}", indices=[${g.matchingIndices?.join(',')}]`)
        })

        // Server-side validation
        const validGroups = recurringGroups.filter((group, index) => {
            const indices = group.matchingIndices || []
            const uniqueIndices = [...new Set(indices)]
            const isValid = uniqueIndices.length >= 2
            console.log(`GROUP ${index + 1} SUPPORT: reflections [${uniqueIndices.join(',')}]`)
            console.log(`Group ${index + 1} unique count: ${uniqueIndices.length}`)
            return isValid
        })

        if (validGroups.length === 0) {
            console.log("CONTINUITY ACCEPTED: false")
            return response.status(200).json({
                summary: `Becoming visible

A clear pattern hasn’t formed yet.

There are moments where the shift happens as you begin.

See if you can notice that moment next time.`
            })
        }

        // Choose the pair with highest count
        validGroups.sort((a, b) => {
            const countA = (new Set(a.matchingIndices || [])).size
            const countB = (new Set(b.matchingIndices || [])).size
            return countB - countA
        })

        console.log("CONTINUITY ACCEPTED: true")

        // Use the highest count group
        const group = validGroups[0]

        const pattern_across_time = (group.pattern_across_time || "This keeps happening when you start something.").replace(/\bmy\b/gi, "your")
        const intention = (group.intention || "[task]").replace(/^plan to /i, "").replace(/ instead\.?$/i, "").replace(/\bmy\b/gi, "your")
        const shift = (group.shift || "[behaviour]").replace(/^plan to /i, "").replace(/ instead\.?$/i, "").replace(/\bmy\b/gi, "your")
        const pointer = (group.pointer || "The shift appears just before you fully begin.").replace(/\bmy\b/gi, "your")

        const markdownSummary = `Becoming visible

${pattern_across_time}

You begin ${intention}, then switch to ${shift}.

${pointer}

See if you can notice that moment next time.`

        return response.status(200).json({
            summary: markdownSummary,
            markdown_summary: markdownSummary,
            validGroups
        })

    } catch (error) {
        console.error("CONTINUITY SUMMARY ERROR:", error)
        return response.status(500).json({
            error: error.message || "Server error"
        })
    }
}
