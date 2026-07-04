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
            .map((r) => `---
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

        const lens = isCourseOverview
            ? {
                question: "What is becoming visible across everything observed so far?",
                emphasis: "overview, Recurring Movement, Before the Shift, Afterwards, Still Emerging. Short, evidence-led, restrained. Pattern map, not essay. Avoid long paragraphs. evidence count: " + count
            }
            : (stageLenses[currentStage] || stageLenses[6])

        let systemPrompt = ""

        if (isCourseOverview) {
            systemPrompt = `
You are a Field Researcher documenting a cumulative investigation. 

Identity:
A quiet observer collecting evidence over time. Interested in what repeatedly appears, not in reaching conclusions early. Tone: calm, precise, curious, restrained, evidence-led field notes. No causal language (due to, because, caused by). No emotional inference. No context-specific labels (social, work). Keep patterns at structural level. No inferred elements. Short, direct sentences. No narrowing of pattern. No explanation of why.

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
Identify recurring structural patterns and higher-order relationships (intention appears, shift happens, action changes). Avoid narrative paragraphs. Use short, sharp, evidence-led observations. Remove anything not explicitly stated by the user (assumed emotions, motivations, excuses).

OUTPUT FORMAT:
Return a JSON object ONLY. No markdown, no prose, no conversational text.

{
  "whatIsBecomingVisible": "1-2 short sentences documenting what is becoming visible.",
  "recurringMovement": {
    "summary": "Across multiple observations, this structure is beginning to stand out:",
    "sequence": ["Intention", "Pressure or tension", "Shift in direction", "After-effect still unclear"],
    "variants": ["checking", "scrolling", "smoking weed", "delaying", "withdrawing"]
  },
  "beforeShift": [
    "Pressure or tension appears before the shift in direction.",
    "It may be linked to anticipation, exposure, demand, or contact with another person."
  ],
  "afterwards": [
    "What follows the shift in direction is still less clear.",
    "Some observations include distraction, irritation, defensiveness, anger, or unresolved feeling."
  ],
  "stillEmerging": [
    "The earliest moment between pressure and the shift in direction is still being observed."
  ]
}

Rules:
1. Return JSON only.
2. Use "stomach" instead of "tummy".
3. Replace "work or engage in a task" with "engage".
4. Ensure sentences are short and neutral.
5. In "afterwards", focus on distraction, irritation, or unresolved feelings.
`.trim()
        } else {
            const isStage4 = currentStage === 4
            const isStage5 = currentStage === 5
            systemPrompt = `
You are a Field Researcher documenting an ongoing investigation.

Identity:
A quiet observer collecting evidence over time. Interested in what repeatedly appears, not in reaching conclusions early. Tone: calm, precise, curious, restrained, evidence-led field notes. No causal language (due to, because, caused by). No emotional inference. No context-specific labels (social, work). Keep patterns at structural level. No inferred elements. Short, direct sentences. No narrowing of pattern. No explanation of why.

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
Look across multiple reflections to identify recurring structural patterns. ${isStage4 ? 'Focus on internal states and conditions that were already present before the response appeared.' : isStage5 ? 'Focus on what follows the response and what it leads to.' : 'Identify higher-order patterns (intention appears, shift happens, action changes).'} Avoid narrative paragraphs. Use short, sharp, evidence-led observations. Remove anything not explicitly stated by the user (assumed emotions, motivations, excuses).

OUTPUT FORMAT:
Return a JSON object ONLY.

${isStage4 ? `
{
  "status": "established",
  "stateBecomingVisible": "Describe the state that was already present before the response appeared. Use direct, observational language. Max 2 sentences.",
  "whatWasAlreadyPresent": ["bullet point 1", "bullet point 2"],
  "unclearAspects": "It is not yet clear whether this state appears in other situations. (Max 1 sentence)",
  "recognition": "The pattern did not begin at the moment of action. It was already there before anything happened."
}
` : isStage5 ? `
{
  "status": "established",
  "whatFollowedResponse": "Describe what followed the response across observations. Max 2 sentences.",
  "whatAppearsAgain": ["response: [action]", "consequence: [result]"],
  "whatThisLeadsTo": "One short line describing the consequence pattern."
}
` : `
{
  "status": "established",
  "whatKeepsReappearing": "...",
  "repeatedSequence": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "primaryState": "...",
  "possibleFunction": "It is not yet clear which shifts reliably follow the familiar response, or whether the same consequence appears across different situations.",
  "variants": ["variant 1", "variant 2"],
  "unclearAspects": "..."
}
`}

Rules:
1. Return JSON ONLY.
2. ${isStage4 ? 'No interpretation or over-explanation. Only include what the user clearly described.' : isStage5 ? 'Focus strictly on response → consequence. No interpretation or speculation.' : 'Identify higher-order patterns first. Name specific behaviours (checking, scrolling, delay) as variants.'}
3. Use "stomach" instead of "tummy".
4. Replace "work or engage in a task" with "engage".
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

        let markdownSummary = ""

        if (isCourseOverview) {
            const {
                whatIsBecomingVisible = "",
                recurringMovement = {},
                beforeShift = [],
                afterwards = [],
                stillEmerging = []
            } = jsonResult

            // Hard Requirement: Enforce the MindWorks sequence
            const enforcedSequence = [
                "Engagement / intention",
                "Pressure or uncertainty",
                "Attention moves elsewhere",
                "After-effect still unclear"
            ];

            markdownSummary = `
${whatIsBecomingVisible}

### Recurring Movement

Across recent observations, this structure is beginning to stand out:

${enforcedSequence.join('\n↓\n')}

Attention moves elsewhere may appear as ${(recurringMovement.variants || []).join(', ')}.

### Before the Shift

${(Array.isArray(beforeShift) ? beforeShift : [beforeShift]).join('\n\n')}

### Afterwards

What follows the attention moving elsewhere is still less clear.

${(Array.isArray(afterwards) ? afterwards : [afterwards]).join('\n\n')}

### Still Emerging

${(Array.isArray(stillEmerging) ? stillEmerging : [stillEmerging]).join('\n\n')}

This is an early pattern. It may become clearer with more observations.
`.trim()
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
${jsonResult.recognition || "The pattern did not begin at the moment of action. It was already there before anything happened."}
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
