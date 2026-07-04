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
                emphasis: "pattern, higher-order patterns, movement away, delay, withdrawal, substitute activity, avoidance of exposure, loss of contact with original intention. Identify higher-order patterns first, then list variants. Avoid diagnosis and explanation. Do not over-explain or force conclusions. Use observational language only. Do not use 'Possible Pattern' as a heading. evidence count: " + count
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
A quiet observer collecting evidence over time. Interested in what repeatedly appears, not in reaching conclusions early. Tone: calm, precise, curious, restrained, evidence-led field notes.

Product Philosophy:
Observation before interpretation. Accumulation before explanation. Progressively discover patterns rather than declare them.

Tone Guidelines:
- Use: beginning to appear, may be, not yet clear, still being observed, not enough evidence yet.
- Avoid: this means, this indicates, this proves, this shows that, the user is...
- Never diagnose. Never over-interpret. Never sound certain.
- Avoid essay style. No long paragraphs. No coaching. No advice.

Evidence Thresholds (Apply based on count ${count}):
1–3 observations: Describe only what is visible. No recurrence language.
4–6 observations: "Something may be beginning to repeat."
7–15 observations: "This relationship appears often enough to be worth watching."
15+ observations: "Across multiple observations, a recurring structure is becoming increasingly visible."

CORE ANALYSIS:
Identify recurring structural patterns and higher-order relationships. Avoid narrative paragraphs. Use short, sharp, evidence-led observations.

COURSE OVERVIEW PRESENTATION:
The question to address is: ${lens.question}

Structure your output into these EXACT sections:

### What is becoming visible
Maximum 1-2 short sentences documenting what is becoming visible. No long introductory paragraphs.

### Recurring Movement
Must use this exact wording and visual sequence (no numbered lists):
Across multiple observations, this structure is beginning to stand out:

Intention
↓
Pressure or tension
↓
Movement away
↓
Consequence still unclear

After the sequence, add only one short sentence naming variants.
Example: "Movement away may appear as checking, scrolling, smoking weed, delaying, withdrawing, cancelling, or doing nothing."
Do not explain the sequence twice in prose.

### Before the Shift
Use this structure (maximum 2 sentences):
"Pressure or tension appears before the movement away. It may be linked to anticipation, exposure, demand, or contact with another person."
Use concrete language from observations if they exist, but keep it to this short format. Use "stomach", never "tummy".

### Afterwards
Use this structure (maximum 3 short sentences):
"What follows is still less clear. Some observations include distraction, irritation, defensiveness, anger, or unresolved feeling. MindWorks does not yet have enough evidence to say which consequence repeats most strongly."
Only include specific emotions (anger, irritation) if present in evidence.

### Still Emerging
Use this structure (maximum 2 sentences):
"The earliest moment between pressure and movement away is still being observed. This is where future observations may become useful."
Do NOT use "further observations may help illuminate."

Rules:
1. Use ONLY these exact headings: "### What is becoming visible", "### Recurring Movement", "### Before the Shift", "### Afterwards", "### Still Emerging".
2. NO numbered lists. NO long paragraphs. NO repetitive explanations.
3. Replace "work or engage in a task" with "engage".
4. Closing sentence: "This is not a conclusion. It is what MindWorks is beginning to notice across the accumulated observations."

OUTPUT FORMAT:
Your output MUST start with a JSON object, then a newline, then the markdown summary.
`.trim()
        } else {
            const isStage3 = currentStage === 3
            systemPrompt = `
You are a Field Researcher documenting an ongoing investigation.

Identity:
A quiet observer collecting evidence over time. Interested in what repeatedly appears, not in reaching conclusions early. Tone: calm, precise, curious, restrained, evidence-led field notes.

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
Look across multiple reflections to identify recurring structural patterns. Identify higher-order patterns (e.g., "An intention is followed by pressure or tension, then by a movement away from the original intention"). Avoid narrative paragraphs. Use short, sharp, evidence-led observations.

Structural patterns to look for:
Intention -> Pressure / body state -> Movement away from original intention -> Consequence (e.g., delay, substitute activity, lingering irritation, partial settling).

PRESENTATION LENS (Stage ${currentStage}):
The user is at Stage ${currentStage}. Present your findings through this specific lens:
- Question to address: ${lens.question}
- Emphasis: ${lens.emphasis}

General Rules:
1. Identify higher-order patterns first. Name specific behaviours (checking, scrolling, delay) as variants.
2. Use tentative, observational language.
3. Do not diagnose, explain, coach, or advise.
4. Use "stomach" instead of "tummy".
5. For "Possible Function", prefer: "It is not yet clear which shifts reliably follow the familiar response, or whether the same consequence appears across different situations."
6. Replace "work or engage in a task" with "engage".

OUTPUT FORMAT:
Your output MUST start with a JSON object, then a newline, then the markdown summary.

Example output:
{
  "status": "established",
  "structural_pattern": "...",
  "sequence": ["...", "..."],
  "primary_state": "...",
  "possible_function": "It is not yet clear which shifts reliably follow the familiar response, or whether the same consequence appears across different situations.",
  "variants": ["...", "..."],
  "unclear_aspects": "..."
}

${isStage3 ? '### What These Moments May Have In Common' : '### What Keeps Reappearing'}
...

JSON Fields:
- "status": "established" | "collecting" | "insufficient"
- "structural_pattern": Short description of the higher-order pattern
- "sequence": ["Step 1", "Step 2", "Step 3", "Step 4"]
- "primary_state": Description of the state before the shift
- "possible_function": "It is not yet clear which shifts reliably follow the familiar response, or whether the same consequence appears across different situations."
- "variants": ["variant 1", "variant 2"]
- "unclear_aspects": What cannot yet be concluded

Markdown Summary sections:
${isStage3 ? '### What These Moments May Have In Common' : '### What Keeps Reappearing'}
### Repeated Sequence
### Primary State
### Possible Function
### What Remains Unclear

If there is not enough evidence to see a pattern, set status to "insufficient" and provide a neutral message in the JSON and Markdown.
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

        // Post-processing fail-safe for Course Overview
        let processedContent = rawContent
        if (isCourseOverview) {
            const mapping = {
                'What Keeps Reappearing': 'Recurring Movement',
                'Repeated Sequence': 'Recurring Movement',
                'Primary State': 'Before the Shift',
                'Possible Function': 'Afterwards',
                'What Remains Unclear': 'Still Emerging'
            }

            const sectionsMap = new Map()
            const lines = rawContent.split('\n')
            let currentSectionTitle = null

            lines.forEach(line => {
                const headingMatch = line.match(/^###\s+(.*)/)
                if (headingMatch) {
                    let rawTitle = headingMatch[1].trim().replace(/[:]$/, '')
                    currentSectionTitle = mapping[rawTitle] || rawTitle

                    if (!sectionsMap.has(currentSectionTitle)) {
                        sectionsMap.set(currentSectionTitle, [])
                    }
                } else {
                    // Collect all lines, including empty ones (for visual maps), if in a section
                    if (currentSectionTitle) {
                        sectionsMap.get(currentSectionTitle).push(line)
                    } else if (line.trim()) {
                        // Handle intro content before any heading
                        currentSectionTitle = "Intro"
                        if (!sectionsMap.has(currentSectionTitle)) {
                            sectionsMap.set(currentSectionTitle, [])
                        }
                        sectionsMap.get(currentSectionTitle).push(line)
                    }
                }
            })

            let rebuiltContent = ""
            sectionsMap.forEach((content, title) => {
                if (title === "Intro") {
                    rebuiltContent += content.join('\n').trim() + "\n\n"
                } else {
                    rebuiltContent += `### ${title}\n${content.join('\n').trim()}\n\n`
                }
            })
            processedContent = rebuiltContent.trim()
        }

        // Extract JSON and Markdown
        let jsonResult = {
            status: "insufficient",
            structural_pattern: "",
            sequence: [],
            primary_state: "",
            possible_function: "",
            variants: [],
            unclear_aspects: ""
        }
        let markdownSummary = processedContent

        try {
            const jsonMatch = processedContent.match(/\{[\s\S]*?\}/)
            if (jsonMatch) {
                jsonResult = JSON.parse(jsonMatch[0])
                // Remove the JSON block and any surrounding whitespace or markdown code block markers
                markdownSummary = processedContent.replace(/```json\s*[\s\S]*?```/g, "")
                                                   .replace(jsonMatch[0], "")
                                                   .trim()
            }
        } catch (e) {
            console.error("JSON PARSE ERROR:", e)
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
