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

        if (count < 3) {
            return response.status(200).json({
                summary: ""
            })
        }

        const recentReflections = reflectionsData
            .map((r, index) => `---
Index: ${index} (0 is most recent)
Week: ${r.week_number}
Date: ${r.created_at}
Observation: ${r.original_reflection}
MindWorks Observation: ${r.ai_response}`)
            .join("\n\n")

        const stageLenses = {
            1: {
                question: "What single observation is becoming visible?",
                emphasis: "first observations, isolated examples, no recurrence yet. evidence count: " + count
            },
            2: {
                question: "What sequence is becoming visible?",
                emphasis: "order, transitions, before / after. evidence count: " + count
            },
            3: {
                question: "What feels familiar across different moments?",
                emphasis: "pattern, higher-order patterns, shift in direction, delay, withdrawal, substitute activity, avoidance of exposure, loss of contact with original intention. Identify higher-order patterns first, then list variants. Avoid diagnosis and explanation. Do not over-explain or force conclusions. Use observational language only. Do not use 'Possible Pattern' as a heading. evidence count: " + count
            },
            4: {
                question: "What conditions tend to be present beforehand?",
                emphasis: "recurring states, body conditions, emotional climate, anticipation, pressure, uncertainty. Do not focus primarily on behaviour. evidence count: " + count
            },
            5: {
                question: "What tends to change afterwards?",
                emphasis: "consequences, lingering emotions, unresolved states, partial settling, continued tension, postponed activity, observable shifts. Avoid: 'function', purpose, motive, protection. evidence count: " + count
            },
            6: {
                question: "How do these observations now fit together?",
                emphasis: "integration, overall organisation, relationships between observations, what has become visible across the whole journey. Do not diagnose. Do not conclude. evidence count: " + count
            }
        }

        const lens = {
            question: "What repetition is becoming visible across these moments?",
            emphasis: "ONE continuous paragraph, no sections, no bullets, no headings. Use natural, human language. Use recurrence phrases: 'again', 'each time', 'across different situations', 'more than once'. evidence count: " + count
        }

        let systemPrompt = ""

        if (isCourseOverview || true) {
            systemPrompt = `
You are a Field Researcher documenting a cumulative investigation. 

Identity:
A quiet observer collecting evidence over time. Interested in what repeatedly appears, not in reaching conclusions early. Tone: calm, precise, curious, restrained, evidence-led field notes. No causal language (due to, because, caused by). No emotional inference. No context-specific labels (social, work). Keep patterns at structural level. No inferred elements. Short, direct sentences. No narrowing of pattern. No explanation of why. Use human, conversational phrasing. MUST use recurrence phrases: "again", "each time", "across different situations", "more than once".

Product Philosophy:
Observation before interpretation. Accumulation before explanation. Progressively discover patterns rather than declare them.

Tone Guidelines:
- Use: beginning to appear, may be, not yet clear, still being observed, not enough evidence yet.
- Avoid: this means, this indicates, this proves, this shows that, the user is...
- Never diagnose. Never over-interpret. Never sound certain.

Evidence Thresholds (Apply based on count ${count}):
3-5 observations: "Something may be beginning to repeat across different situations."
6-10 observations: "This happens again and again, each time you begin something."

CORE ANALYSIS:
1. Detect patterns that appear in MORE THAN ONE reflection. IGNORE single-moment observations.
2. Focus on RECURRENCE. If it doesn't happen more than once, it is not a pattern.
3. Score each pattern based on:
   - Frequency: number of matching reflections (must be > 1).
   - Recency: reflections with lower indices (more recent) carry more weight.
4. SELECT THE SINGLE HIGHEST SCORING RECURRING PATTERN.
5. GENERATION STRUCTURE (MANDATORY):
   - Sentence 1: Refer to the pattern across time (e.g., "This keeps happening when you start something...")
   - Sentence 2: Concrete behaviour (e.g., "You begin [task], then shift to [behaviour] instead.")
   - Sentence 3: Detection/Pointer (e.g., "There’s often a brief moment just before the shift.")
6. NO single-scenario summaries. If output could be from one moment, it is invalid.
7. Provide raw fragments for JSON fields:
   - pattern_across_time: A sentence describing the recurrence (e.g., "This keeps happening when you start something...")
   - intention: raw action (e.g., "start working"). NO "plan to".
   - shift: raw action taken instead (e.g., "check social media"). NO "instead".
   - consequence: raw result (e.g., "delay"). NO "this leads to".
   - pointer: a brief pointer sentence (e.g., "There is often a brief moment just before the shift.")

Language and Perspective:
- Use second-person perspective ONLY ("you", "your"). Replace "I", "my", "me" with "you", "your".
- Use consistent PRESENT TENSE (e.g., "you shift" instead of "you shifted").
- Ensure the summary reads naturally as a description of the user's recurring experience.

OUTPUT FORMAT:
Return a JSON object ONLY.

{
  "dominantPattern": {
    "pattern_across_time": "repetition description",
    "intention": "raw intention fragment",
    "shift": "raw shift fragment",
    "consequence": "raw consequence fragment",
    "pointer": "pointer sentence",
    "score": "float",
    "matchingIndices": [0, 1, 3]
  }
}

Rules:
1. Return JSON only.
2. Use "stomach" instead of "tummy".
3. Replace "work or engage in a task" with "engage".
4. Ensure sentences are short and neutral.
5. "dominantPattern" must be the SINGLE highest-scoring recurring pattern. NO blending. NO "or". Use the user's specific phrasing where possible.
6. Strictly follow the Language and Perspective rules.
7. REUSE specific user phrasing for actions.
8. No gerunds after "then". Use present simple (e.g., "start, then check" NOT "start, then checking").
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
            // Fallback for failed JSON
            return response.status(200).json({
                summary: "MindWorks is collecting observations. The pattern is starting to show.",
                markdown_summary: "MindWorks is collecting observations. The pattern is starting to show."
            })
        }

        // Define confidence levels based on pattern strength
        const dominantPattern = jsonResult.dominantPattern || {}
        const matchingIndices = dominantPattern.matchingIndices || []
        const matchingCount = matchingIndices.length
        
        const isStrong = matchingCount > 5
        const isEmerging = matchingCount >= 3 && matchingCount <= 5
        const isEarly = matchingCount < 3
        
        const verbs = {
            tend: isEarly ? "sometimes" : (isStrong ? "consistently" : "tend to"),
            often: isEarly ? "sometimes" : (isStrong ? "reliably" : "often")
        }

        let markdownSummary = ""

        if (isCourseOverview || true) {
            const {
                dominantPattern = {}
            } = jsonResult

            const pattern_across_time = (dominantPattern.pattern_across_time || "This keeps happening when you start something.").replace(/\bmy\b/gi, "your")
            const intention = (dominantPattern.intention || "[start with intention]").replace(/^plan to /i, "").replace(/ instead\.?$/i, "").replace(/\bmy\b/gi, "your")
            const shift = (dominantPattern.shift || "[shift into distraction/withdrawal]").replace(/^plan to /i, "").replace(/ instead\.?$/i, "").replace(/\bmy\b/gi, "your")
            const consequence = (dominantPattern.consequence || "[delay]").replace(/^this leads to /i, "").replace(/\bmy\b/gi, "your")
            const pointer = (dominantPattern.pointer || "There is often a brief moment just before the shift.").replace(/\bmy\b/gi, "your")

            markdownSummary = `${pattern_across_time} You begin ${intention}, then shift to ${shift} instead, which usually leads to ${consequence}. ${pointer}`

            markdownSummary = markdownSummary.replace(/\s+/g, ' ').trim()

            return response.status(200).json({
                summary: markdownSummary,
                markdown_summary: markdownSummary
            });
        } else {
            const isStage3 = currentStage === 3
            const isStage4 = currentStage === 4
            const title = isStage3 ? 'What These Moments May Have In Common' : (isStage4 ? 'The State Becoming Visible' : 'What Keeps Reappearing')
            
            if (isStage4) {
                markdownSummary = `
### The State Becoming Visible
${jsonResult.stateBecomingVisible || ""}

### What Was Already Present
${(jsonResult.whatWasAlreadyPresent || []).map(item => `- ${item}`).join('\n')}

### What Remains Unclear
${jsonResult.unclearAspects || "It is not yet clear whether this state appears in other situations."}

### A Recognition
${jsonResult.recognition || "The pattern did not begin at the moment of action. It was already there before anything happened."} There is often a brief moment before the shift.
`.trim()
            } else {
                markdownSummary = `
### ${title}
${jsonResult.whatKeepsReappearing || ""}

### Repeated Sequence
${(jsonResult.repeatedSequence || []).join(' → ')}

### Primary State
${jsonResult.primaryState || ""}

### Possible Function
${jsonResult.possibleFunction || "It is not yet clear which shifts reliably follow the familiar response, or whether the same consequence appears across different situations."}

### What Remains Unclear
${jsonResult.unclearAspects || ""}

There is often a brief moment before the shift.
`.trim()
            }
        }

        return response.status(200).json({
            ...jsonResult,
            summary: markdownSummary,
            markdown_summary: markdownSummary
        })

    } catch (error) {
        console.error("CONTINUITY SUMMARY ERROR:", error)
        return response.status(500).json({
            error: error.message || "Server error"
        })
    }
}
