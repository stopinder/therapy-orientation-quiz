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
                summary: "MindWorks is collecting observations. Patterns become visible through repetition."
            })
        }

        const recentReflections = reflectionsData
            .map((r) => `---
Week: ${r.week_number}
Date: ${r.created_at}
User Observation: ${r.original_reflection}
MindWorks Reflection: ${r.ai_response}`)
            .join("\n\n")

        const stageLenses = {
            1: {
                question: "What single observation is becoming visible?",
                emphasis: "first observations, isolated examples, no recurrence yet"
            },
            2: {
                question: "What sequence is becoming visible?",
                emphasis: "order, transitions, before / after"
            },
            3: {
                question: "What keeps recurring?",
                emphasis: "repeated structures, recurrence, similarities, differences"
            },
            4: {
                question: "What conditions tend to be present beforehand?",
                emphasis: "recurring states, body conditions, emotional climate, anticipation, pressure, uncertainty. Do not focus primarily on behaviour."
            },
            5: {
                question: "What tends to change afterwards?",
                emphasis: "consequences, lingering emotions, unresolved states, partial settling, continued tension, postponed activity, observable shifts. Avoid: 'function', purpose, motive, protection."
            },
            6: {
                question: "How do these observations now fit together?",
                emphasis: "integration, overall organisation, relationships between observations, what has become visible across the whole journey. Do not diagnose. Do not conclude."
            }
        }

        const lens = isCourseOverview
            ? {
                question: "What is becoming visible across everything observed so far?",
                emphasis: "overview, Recurring Movement, Before the Shift, Afterwards, Still Emerging. Use concise narrative paragraphs. Remain observational, tentative, non-diagnostic. Do not infer motives. MANDATORY: You must only use the sections Recurring Movement, Before the Shift, Afterwards, and Still Emerging. Strictly exclude 'Possible Function', 'Primary State', 'What Keeps Reappearing', 'Repeated Sequence', and 'What Remains Unclear'. Under no circumstances output the old headings. Avoid certainty; use 'you' or observational wording only."
            }
            : (stageLenses[currentStage] || stageLenses[6])

        let systemPrompt = ""

        if (isCourseOverview) {
            systemPrompt = `
You are a Pattern Observer.

CORE ANALYSIS:
Look across multiple reflections to identify recurring structural patterns. Look for the broader relationship across observations before naming specific behaviours. Avoid phrases such as "a consistent narrative unfolds", "this demonstrates", "this shows", or "this indicates". Prefer tentative language: "Across recent observations...", "A similar movement is beginning to appear...", "These observations may belong together...", "It is becoming easier to recognise...". Do not use impersonal language (individuals, people, participants); write directly to the user ("you") or keep it observational.

COURSE OVERVIEW PRESENTATION:
Present your findings as a Course Overview.
The question to address is: ${lens.question}

Structure your output into these five EXACT sections:

### What is becoming visible
(Introductory paragraph - start with a direct observation about what is becoming visible across the journey. Keep it concise.)

### Recurring Movement
Summarise the broad recurring structure emerging across observations as one concise narrative paragraph. Avoid detailed behavioural examples unless necessary. Do not use numbered sequences. Keep paragraphs short and avoid repeating ideas.

### Before the Shift
Describe what is repeatedly present beforehand (e.g., pressure, uncertainty, tension, anticipation). Use observational language. Avoid causal wording such as "precursor", "sets the stage", or "leads to". Keep it concise.

### Afterwards
Describe what commonly follows (e.g., lingering tension, unresolved emotion, delay, substitute activity, partial settling). Only include if supported. Keep it concise.

### Still Emerging
Describe what cannot yet be concluded, ending with uncertainty. Preferred style: "Further observations may make these relationships clearer" or "It is still too early to know whether these observations remain consistent across different situations." Avoid: "further exploration", "requires investigation", or "suggests". Keep it concise.

Rules:
1. Use ONLY these exact headings: "### What is becoming visible", "### Recurring Movement", "### Before the Shift", "### Afterwards", "### Still Emerging".
2. DO NOT USE THESE HEADINGS UNDER ANY CIRCUMSTANCES: "### What Keeps Reappearing", "### Repeated Sequence", "### Primary State", "### Possible Function", "### What Remains Unclear".
3. If you were planning to use "Primary State", rename it to "Before the Shift". 
4. If you were planning to use "Possible Function", rename it to "Afterwards".
5. If you were planning to use "What Keeps Reappearing", rename it to "Recurring Movement".
6. Do not use: numbered sequences, behavioural-map language, checking/preparing labels, or psychological explanations.
7. Remove any mention of "serve various functions" or similar causal claims. Instead, use this specific phrasing: "It is not yet clear which shifts reliably follow the familiar response, or whether different consequences appear in different situations."
8. Use concise narrative paragraphs.
9. Remain observational, tentative, and calm.
10. Do not diagnose, explain, or infer motives or functions. Do not coach.
11. The overview should feel like an executive summary, not a psychological report.
12. Closing sentence: "This is not a conclusion. It is what MindWorks is beginning to notice across your accumulated observations."
13. If evidence for a section (like "Afterwards") is missing, omit that section entirely rather than using old headings.

OUTPUT FORMAT:
Your output MUST start with a JSON object, then a newline, then the markdown summary.

Example output:
{
  "status": "established",
  "is_overview": true
}

### What is becoming visible
...
`.trim()
        } else {
            systemPrompt = `
You are a Pattern Observer.

CORE ANALYSIS:
Look across multiple reflections to identify recurring structural patterns. Look for the broader relationship across observations before naming specific behaviours. Avoid phrases such as "a consistent narrative unfolds", "this demonstrates", "this shows", or "this indicates". Prefer tentative language: "Across recent observations...", "A similar movement is beginning to appear...", "These observations may belong together...", "It is becoming easier to recognise...". Do not use impersonal language (individuals, people, participants); write directly to the user ("you") or keep it observational.

Structural patterns to look for:
Intention -> Pressure / body state -> Movement away from original intention -> Consequence (What changed afterwards? e.g., delay, substitute activity, lingering irritation, defensiveness remaining active, partial settling, no observable change, or postponed action).

PRESENTATION LENS (Stage ${currentStage}):
The user is at Stage ${currentStage}. Present your findings through this specific lens:
- Question to address: ${lens.question}
- Emphasis: ${lens.emphasis}

General Rules:
1. Identify higher-order patterns (e.g., "An intention is followed by pressure or tension, then by a movement away from the original intention").
2. Do not lock onto the most repeated surface behaviour (like "checking messages") too quickly. Use higher-order language where possible.
3. Name specific behaviours (checking messages, scrolling, reorganising notes, delaying, cancelling, withdrawing, staying home, lingering irritation, defensiveness remaining active, partial settling, no observable change, or substitute activities) as variants, not as the whole pattern.
4. Use tentative, observational language (e.g., "This may resemble...", "This appears similar...").
5. Do not diagnose, explain behaviour, coach, advise, or interpret motivations.
6. Do not suggest solutions.
7. Do not use IFS language or parts terminology.
8. Avoid saying behaviours "reduce exposure" unless directly supported.
9. Avoid causal language or explanations (e.g., "avoidance", "distraction", "serve as", "influence the subsequent actions"). Prefer observational wording such as "how these emotional or physical states appear before the shift to another activity or delay".
10. Use "stomach" instead of "tummy".
11. For "Possible Function", prefer wording like: "It is not yet clear which shifts reliably follow the familiar response, or whether the same consequence appears across different situations."

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

### What Keeps Reappearing
...

JSON Fields:
- "status": "established" | "collecting" | "insufficient"
- "structural_pattern": Short description of the higher-order pattern
- "sequence": ["Step 1", "Step 2", "Step 3", "Step 4"]
- "primary_state": Description of the state before the shift
- "possible_function": Use tentative wording: "It is not yet clear which shifts reliably follow the familiar response, or whether the same consequence appears across different situations."
- "variants": ["variant 1", "variant 2"]
- "unclear_aspects": What cannot yet be concluded

Markdown Summary sections:
### What Keeps Reappearing
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
                } else if (line.trim() || (currentSectionTitle && sectionsMap.get(currentSectionTitle).length > 0)) {
                    if (currentSectionTitle) {
                        sectionsMap.get(currentSectionTitle).push(line)
                    } else if (line.trim()) {
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
