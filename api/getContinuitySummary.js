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

        if (count === 0) {
            return response.status(200).json({
                summary: ""
            })
        }

        if (count === 1) {
            return response.status(200).json({
                summary: ""
            })
        }

        if (count === 2) {
            return response.status(200).json({
                summary: currentStage === 3 
                    ? "MindWorks is beginning to notice patterns as different moments are compared. For now, the focus remains on simple observation."
                    : "MindWorks is collecting observations. Recurrence may become easier to recognise as more moments are documented."
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

        const lens = isCourseOverview || true
            ? {
                question: "What is becoming visible across everything observed so far?",
                emphasis: "ONE continuous paragraph, no sections, no bullets, no headings. Use natural, human language. No system terms like 'across situations' or 'early pattern'. evidence count: " + count
            }
            : (stageLenses[currentStage] || stageLenses[6])

        let systemPrompt = ""

        if (isCourseOverview || true) {
            systemPrompt = `
You are a Field Researcher documenting a cumulative investigation. 

Identity:
A quiet observer collecting evidence over time. Interested in what repeatedly appears, not in reaching conclusions early. Tone: calm, precise, curious, restrained, evidence-led field notes. No causal language (due to, because, caused by). No emotional inference. No context-specific labels (social, work). Keep patterns at structural level. No inferred elements. Short, direct sentences. No narrowing of pattern. No explanation of why. Use human, conversational phrasing. Avoid "across situations", "this is an early pattern", or "what follows the response". Instead use: "it’s not always the same what happens after that", "the pattern is starting to show".

Product Philosophy:
Observation before interpretation. Accumulation before explanation. Progressively discover patterns rather than declare them.

Tone Guidelines:
- Use: beginning to appear, may be, not yet clear, still being observed, not enough evidence yet.
- Avoid: this means, this indicates, this proves, this shows that, the user is...
- Never diagnose. Never over-interpret. Never sound certain.

Evidence Thresholds (Apply based on count ${count}):
1–3 observations: Describe only what is visible. No recurrence language.
4–6 observations: "Something may be beginning to repeat."
7–15 observations: "This relationship appears often enough to be worth watching."
15+ observations: "Across multiple observations, a recurring structure is becoming increasingly visible."

CORE ANALYSIS:
1. Extract ALL candidate patterns (intention → behavior sequences) from the reflections.
2. Maintain a set of possible patterns. Do not blend them.
3. For each pattern, identify which reflections (by Index) match it.
4. Score each pattern based on:
   - Frequency: number of matching reflections.
   - Recency: reflections with lower indices (more recent) carry significantly more weight.
5. SELECT THE SINGLE HIGHEST SCORING PATTERN. IGNORE all other patterns.
6. NO multiple behaviors in one sentence. NO "or". NO lists. NO blending.
7. SENTENCE GENERATION:
   - Generate 3 candidate sentences for the dominant pattern.
   - All candidates must follow the structure: "You [frequency] [action], then [alternative] instead."
   - Prefer variants with timing cues (e.g., "start", "begin", "as you begin").
   - Penalize "plan to", "engage in", "initiate", or overly generic words.
   - Select the MOST natural and recognizable one.
8. DO NOT generate a full sentence for the final output. Provide ONLY raw fragments for the JSON fields:
   - intention: the raw action from the SELECTED best variant (e.g., "start working", "begin replying"). DO NOT include "plan to".
   - shift: the raw action taken instead (e.g., "check social media", "switch to your phone"). DO NOT include "instead".
   - consequence: the raw result (e.g., "delay", "frustration"). DO NOT include "this leads to".
9. Remove anything not explicitly stated by the user (assumed emotions, motivations, excuses). 
10. PRIORITIZE concrete user phrasing (e.g., "checking social media") over generic terms. 
11. Perspective: Convert ALL first-person to second-person (I -> you, my -> your).
12. Modal check: Avoid "may" or "might". Use "sometimes", "often", or "tend to".

Language and Perspective:
- Use second-person perspective ONLY ("you", "your"). Replace "I", "my", "me" with "you", "your".
- Use consistent PRESENT TENSE (e.g., "you shift" instead of "you shifted").
- Ensure the summary reads naturally as a description of the user's recurring experience.

OUTPUT FORMAT:
Return a JSON object ONLY.

{
  "dominantPattern": {
    "intention": "raw fragment of intention",
    "shift": "raw fragment of behavior/action they did instead",
    "consequence": "raw fragment of specific result",
    "score": "float",
    "matchingIndices": [0, 1, 3]
  },
  "allCandidates": [
    {
       "summary": "Just as you [intention], you [shift] instead",
       "score": 0.8
    }
  ],
  "stateLine": "concrete states explicitly present in reflections (e.g. anger, pressure)",
  "consequenceConsistency": "becoming visible / not yet consistent"
}

Rules:
1. Return JSON only.
2. Use "stomach" instead of "tummy".
3. Replace "work or engage in a task" with "engage".
4. Ensure sentences are short and neutral.
5. "dominantPattern" must be the SINGLE highest-scoring pattern. NO blending. NO "or". Use the user's specific phrasing where possible.
6. "stateLine" must only include states explicitly present in reflections. If none, return null.
7. NO section names should be returned in any field value.
8. Strictly follow the Language and Perspective rules.
9. REUSE specific user phrasing for actions.
10. No gerunds after "then". Use present simple (e.g., "start, then check" NOT "start, then checking").
`.trim()
        } else {
            const isStage4 = currentStage === 4
            const isStage5 = currentStage === 5
            systemPrompt = `
You are a Field Researcher documenting an ongoing investigation.

Identity:
A quiet observer collecting evidence over time. Interested in what repeatedly appears, not in reaching conclusions early. Tone: calm, precise, curious, restrained, evidence-led field notes. No causal language (due to, because, caused by). No emotional inference. No context-specific labels (social, work). Keep patterns at structural level. No inferred elements. Short, direct sentences. No narrowing of pattern. No explanation of why. Use human, conversational phrasing. Avoid "across situations", "this is an early pattern", or "what follows the response". Instead use: "it’s not always the same what happens after that", "the pattern is starting to show". ${isStage5 ? 'Stage 5 must NOT describe patterns across time. Only describe what is directly observable.' : ''}

Product Philosophy:
Observation before interpretation. Accumulation before explanation. Progressively discover patterns rather than declare them.

Tone Guidelines:
- Use: beginning to appear, may be, not yet clear, still being observed, not enough evidence yet.
- Avoid: this means, this indicates, this proves, this shows that, the user is...
- Never diagnose. Never over-interpret. Never sound certain.

Evidence Thresholds (Apply based on count ${count}):
${isStage5 ? '1+ observations: Describe only what is directly observable: response → consequence. No recurrence language.' : `1–3 observations: Describe only what is visible. No recurrence language.
4–6 observations: "Something may be beginning to repeat."
7–15 observations: "This relationship appears often enough to be worth watching."
15+ observations: "Across multiple observations, a recurring structure is becoming increasingly visible."`}

CORE ANALYSIS:
Extract concrete actions, not concepts. Look across multiple reflections to identify recurring behaviors. ${isStage4 ? 'Focus on internal states and conditions that were already present before the response appeared.' : isStage5 ? 'Focus strictly on what followed the response (response → consequence). Do not explain the pattern or describe patterns across time. Avoid ambiguous phrasing like "a sense of denial". Replace with observable descriptions like "frustration appeared" or "conflict followed".' : 'Identify patterns from action sequences (just as you [intention], you [actual behavior]).'} Avoid narrative paragraphs. Use short, sharp, evidence-led observations. Remove anything not explicitly stated by the user (assumed emotions, motivations, excuses). PRIORITIZE concrete user phrasing (e.g. "checking Instagram" instead of "distraction") and reuse it converted to second-person and present tense. If no specific behaviour is clear, use "do something else instead" or "don't follow through". No gerunds after "then". Use present simple (e.g., "start, then check" NOT "start, then checking"). The sentence MUST include "instead".

Language and Perspective:
- Use second-person perspective ONLY ("you", "your"). Replace "I", "my", "me" with "you", "your".
- Use consistent PRESENT TENSE.
- Use natural language. Replace "felt frustration" with "frustration follows". Replace "denial mode" with "the other person denies it".
- REUSE specific user phrasing for actions. Convert "I checked Instagram" to "you check Instagram".

OUTPUT FORMAT:
Return a JSON object ONLY.

${isStage4 ? `
{
  "status": "established",
  "stateBecomingVisible": "Describe the state that was already present before the response appeared. Use second-person, present tense. Max 2 sentences.",
  "whatWasAlreadyPresent": ["bullet point 1 in second-person, present tense", "bullet point 2"],
  "unclearAspects": "It is not yet clear whether this state appears in other situations. (Max 1 sentence)",
  "recognition": "The pattern did not begin at the moment of action. It was already there before anything happened."
}
` : isStage5 ? `
{
  "status": "established",
  "whatFollowedResponse": "Describe what followed the response across observations. Strictly observable: response → consequence. Use second-person, present tense. Max 2 sentences.",
  "whatAppearsAgain": ["response: [action in second-person, present tense]", "consequence: [result in second-person, present tense]"],
  "whatThisLeadsTo": "One short line describing the consequence pattern in second-person, present tense."
}
` : `
{
  "status": "established",
  "whatKeepsReappearing": "Use second-person, present tense...",
  "repeatedSequence": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "primaryState": "Use second-person, present tense...",
  "possibleFunction": "It is not yet clear which shifts reliably follow the familiar response, or whether the same consequence appears across different situations.",
  "variants": ["variant 1", "variant 2"],
  "unclearAspects": "..."
}
`}

Rules:
1. Return JSON ONLY.
2. ${isStage4 ? 'No interpretation or over-explanation. Only include what the user clearly described.' : isStage5 ? 'Focus strictly on response → consequence. No interpretation, no explanation, no ambiguity. Keep sentences short and concrete. No pattern confirmation language (e.g. "this repeats across reflections"). Keep bullet points only in whatAppearsAgain.' : 'Identify higher-order patterns first. Name specific behaviours (checking, scrolling, delay) as variants.'}
3. Use "stomach" instead of "tummy".
4. Replace "work or engage in a task" with "engage".
5. Strictly follow the Language and Perspective rules.
`.trim()
        }

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
                summary: "MindWorks is collecting observations. Recurrence may become easier to recognise as more moments are documented.",
                markdown_summary: "MindWorks is collecting observations. Recurrence may become easier to recognise as more moments are documented."
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
                dominantPattern = {},
                stateLine = null,
                consequenceConsistency = "not yet consistent"
            } = jsonResult

            const intention = (dominantPattern.intention || "[start with intention]").replace(/^plan to /i, "").replace(/ instead\.?$/i, "")
            const shift = (dominantPattern.shift || "[shift into distraction/withdrawal]").replace(/^plan to /i, "").replace(/ instead\.?$/i, "")
            const consequence = (dominantPattern.consequence || "[tension / negative response / delay]").replace(/^this leads to /i, "")

            const frequency = isEarly ? "sometimes" : (isStrong ? "reliably" : "tend to");
            
            // Start building the paragraph
            markdownSummary = `You ${frequency} ${intention}, then ${shift} instead. This leads to ${consequence}.`

            if (stateLine) {
                markdownSummary += ` Before this shift, there is ${verbs.often} a state already present, such as ${stateLine}.`
            }

            if (consequenceConsistency.includes("visible")) {
                markdownSummary += ` It’s not always the same what happens after that, but a pattern is starting to show.`
            } else {
                markdownSummary += ` What follows that isn’t always the same across different situations.`
            }

            markdownSummary += ` It’s still early, and the pattern may become clearer as more moments are documented.`

            // Real-time perception pointer (New paragraph for separation)
            markdownSummary += `\n\nThere is often a brief moment just before the shift.`
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
