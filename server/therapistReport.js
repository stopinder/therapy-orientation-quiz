import { reportSections } from '../src/quiz/therapist/content.js'
import { isPlainObject } from '../src/quiz/therapist/scoring.js'

export const REPORT_INSTRUCTIONS = `You write reflective reports for qualified or trainee therapists completing “What kind of therapist are you?”.
The supplied JSON is a deterministic result, not a clinical assessment. Your job is synthesis and writing, not scoring or discovering a new profile.

EVIDENCE BOUNDARIES
Use only supplied dimension interpretations, authored possibilities, themes and evidence. Retain counter-evidence and insufficient-evidence findings. Do not select a different primary tendency, create a default type or turn mixed answers into proof of flexibility. An answer is a response to a hypothetical scenario, not observed practice.
Clearly separate “your selections suggest” from “one possibility to explore”. Strengths, blind spots and possible client experiences are hypotheses, never findings. Use “may”, “appear to lean”, “a useful question might be”. Do not infer actual client outcomes.
Do not invent trauma, diagnosis, pathology, attachment style, motives, biography or personal history. Do not assess competence, accreditation, fitness to practise, suitability for a modality or superiority of one approach. Do not recommend practising a modality. This is not supervision.
Do not imply that structure opposes collaboration, experience opposes thought, interpretation opposes collaboration, or change opposes relationship. Do not equate restraint with professional virtue or direction with domination. All poles are legitimate preferences in the scenario, not good and bad answers.
In particular, the diagnostic-conversation answer cannot establish a diagnostic ideology, and the hypothesis answer cannot measure tolerance of uncertainty. Honour the explicit scope of each theme.

WRITING
Write in thoughtful, accessible British English. Integrate dimensions into a recognisable account rather than repeating six definitions. Attend to what the person may regard as useful therapeutic knowledge, how the work gets its direction and what makes an encounter feel worthwhile, but only when supported.
Explore the possible cost of a strength without presenting a defect. A supervisory question should make room for inquiry, not disguise an accusation. Do not flatter, moralise or use magazine-style personality labels. End with a revisable description of therapeutic identity, not “you are this type”.
When evidence is sufficient, aim for 900–1,200 words across the report. With substantial omissions, use 450–750 words and make limits explicit. Never invent depth to meet a word target. Avoid repeating the same observation under several headings.
The example report has not yet been supplied to this implementation. Do not claim to have matched a specific example or copy a hypothetical example's conclusions.

SECTIONS
stance: synthesise the most prominent tendencies, keeping equally prominent tendencies together.
work: describe how tendencies combine, using selected scenarios and counterexamples.
expertise: discuss the selected expertise-related scenarios within their stated limits.
clients: clearly hypothetical, varied experiences clients might have; no universal client claims.
strengths: develop two or three supplied possible strengths and conditions under which they may be useful.
tensions: one or two supplied contrasts or trade-offs, explicitly framed as questions. Never invent a contradiction.
limits: conditions in which the supplied possible trade-offs warrant revisiting a usual approach, not prescriptive clinical advice.
supervision: three or four distinct, open questions grounded in the available evidence.
identity: a brief tentative description in ordinary language, with no rigid label.

FORMAT
Return the specified JSON only. Each section has paragraphs and evidenceIds. evidenceIds must refer to the supplied authored evidence supporting the discussion. Use plain text only, with no HTML or markdown headings. Do not add new fields. The application displays the fixed safety notice separately.`

export function reportSchema(result) {
  const evidenceIds = result.evidence.map(e => e.id)
  const section = {
    type: 'object', additionalProperties: false,
    properties: {
      paragraphs: { type: 'array', items: { type: 'string' } },
      evidenceIds: { type: 'array', items: { type: 'string', enum: evidenceIds } }
    },
    required: ['paragraphs', 'evidenceIds']
  }
  return {
    type: 'object', additionalProperties: false,
    properties: Object.fromEntries(reportSections.map(s => [s.id, section])),
    required: reportSections.map(s => s.id)
  }
}

/** Shape/traceability checks are not a substitute for reviewing generated prose. */
export function validateReport(value, result) {
  if (!isPlainObject(value) || Object.keys(value).length !== reportSections.length) throw new Error('Invalid report shape')
  const knownEvidence = new Set(result.evidence.map(e => e.id))
  let totalLength = 0
  const sections = reportSections.map(section => {
    const data = value[section.id]
    if (!isPlainObject(data) || Object.keys(data).sort().join(',') !== 'evidenceIds,paragraphs') throw new Error('Invalid section')
    if (!Array.isArray(data.paragraphs) || data.paragraphs.length < 1 || data.paragraphs.length > 6) throw new Error('Invalid paragraphs')
    if (!Array.isArray(data.evidenceIds) || data.evidenceIds.length > result.evidence.length || data.evidenceIds.some(id => !knownEvidence.has(id))) throw new Error('Unknown evidence')
    if (section.id !== 'supervision' && !data.evidenceIds.length) throw new Error('Missing evidence')
    const paragraphs = data.paragraphs.map(text => {
      if (typeof text !== 'string' || !text.trim() || text.length > 3500 || /<\/?[a-z][^>]*>/i.test(text)) throw new Error('Invalid text')
      if (/you are definitely|you should practi[cs]e|your (?:attachment style|trauma history|diagnosis) is|you (?:have|suffer from) (?:adhd|a personality disorder)/i.test(text)) throw new Error('Prohibited claim')
      totalLength += text.length
      return text.trim()
    })
    return { ...section, paragraphs, evidenceIds: [...new Set(data.evidenceIds)] }
  })
  if (totalLength < 500 || totalLength > 22000) throw new Error('Unexpected report length')
  return { sections }
}

export async function generateReport(result, { apiKey, model = 'gpt-4.1-mini', fetchImpl = globalThis.fetch, timeoutMs = 45000 }) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetchImpl('https://api.openai.com/v1/chat/completions', {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        store: false,
        temperature: 0.5,
        max_completion_tokens: 5000,
        response_format: { type: 'json_schema', json_schema: { name: 'therapist_reflection', strict: true, schema: reportSchema(result) } },
        messages: [
          { role: 'system', content: REPORT_INSTRUCTIONS },
          { role: 'user', content: JSON.stringify(result) }
        ]
      })
    })
    if (!response.ok) throw new Error('Provider request failed')
    const data = await response.json()
    const choice = data?.choices?.[0]
    if (choice?.finish_reason !== 'stop' || choice?.message?.refusal || typeof choice?.message?.content !== 'string') throw new Error('Incomplete report')
    if (choice.message.content.length > 30000) throw new Error('Oversize report')
    return validateReport(JSON.parse(choice.message.content), result)
  } finally {
    clearTimeout(timer)
  }
}
