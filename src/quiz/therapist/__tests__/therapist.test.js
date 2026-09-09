import { describe, it, expect, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { therapistQuestions, QUIZ_VERSION, CONTEXT_ANSWER } from '../questions.js'
import { dimensions, reportSections, DISCLAIMER } from '../content.js'
import { scoreAnswers, validateAnswers } from '../scoring.js'
import { buildResult, buildFallbackReport } from '../buildResult.js'
import { createHandler, createWarmLimiter, aiAvailable } from '../../../../api/therapist-report.js'
import { generateReport, validateReport, reportSchema } from '../../../../server/therapistReport.js'

const all = (choice = 'a') => Object.fromEntries(therapistQuestions.map(q => [q.id, choice]))
const request = (overrides = {}) => ({
  method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://example.test', host: 'example.test' },
  body: { quizVersion: QUIZ_VERSION, answers: all(), consent: true }, ...overrides
})
const response = () => ({
  code: null, data: null, headers: {},
  setHeader(key, value) { this.headers[key] = value },
  status(code) { this.code = code; return this },
  json(data) { this.data = data; return this }
})
const validGenerated = result => Object.fromEntries(reportSections.map(section => [section.id, {
  paragraphs: ['Your selections suggest a starting point for reflection rather than a fixed identity. A useful question is how this preference changes with the particular client and situation.'],
  evidenceIds: [result.evidence[0].id]
}]))

describe('new questionnaire content', () => {
  it('has 15 uniquely identified scenarios and four substantive options each', () => {
    expect(therapistQuestions).toHaveLength(15)
    expect(new Set(therapistQuestions.map(q => q.id)).size).toBe(15)
    for (const q of therapistQuestions) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options.map(o => o.id)).size).toBe(4)
      for (const option of q.options) {
        expect(Object.keys(option.weights)).toHaveLength(2)
        for (const [key, weight] of Object.entries(option.weights)) {
          expect(dimensions.some(d => d.id === key)).toBe(true)
          expect([-2, 2]).toContain(weight)
        }
      }
    }
  })
  it('gives every dimension five opportunities, including both poles in each', () => {
    for (const dimension of dimensions) {
      const questions = therapistQuestions.filter(q => q.options.some(o => Object.hasOwn(o.weights, dimension.id)))
      expect(questions).toHaveLength(5)
      for (const q of questions) {
        expect(q.options.some(o => o.weights[dimension.id] === -2)).toBe(true)
        expect(q.options.some(o => o.weights[dimension.id] === 2)).toBe(true)
      }
    }
  })
})

describe('deterministic scoring', () => {
  it('returns exactly the same result irrespective of answer insertion order', () => {
    const reversed = Object.fromEntries(Object.entries(all()).reverse())
    expect(buildResult(reversed)).toEqual(buildResult(all()))
  })
  it.each([['a', -1, 'negative'], ['b', 1, 'positive']])('normalises %s selections against actual available weight', (choice, position, lean) => {
    for (const d of scoreAnswers(all(choice)).dimensionScores) {
      expect(d.position).toBe(position)
      expect(d.lean).toBe(lean)
      expect(d.availableWeight).toBe(10)
      expect(d.itemCount).toBe(5)
    }
  })
  it('treats all context responses as insufficient evidence, not a default type', () => {
    const result = buildResult(all(CONTEXT_ANSWER))
    expect(result.sufficientForNarrative).toBe(false)
    expect(result.primaryDimensions).toEqual([])
    expect(result.evidence).toEqual([])
    expect(result.dimensions.every(d => d.status === 'insufficient' && d.lean === null)).toBe(true)
  })
  it('requires three usable items for a dimension', () => {
    const answers = all(CONTEXT_ANSWER)
    answers.q03 = 'a'; answers.q07 = 'a'
    expect(scoreAnswers(answers).dimensionScores.find(d => d.id === 'structure').status).toBe('insufficient')
    answers.q08 = 'a'
    const score = scoreAnswers(answers).dimensionScores.find(d => d.id === 'structure')
    expect(score.lean).toBe('negative')
    expect(score.availableWeight).toBe(6)
  })
  it('retains mixed responses without calling them flexibility', () => {
    const answers = all('a')
    answers.q03 = 'b'; answers.q07 = 'b'
    const result = buildResult(answers)
    const structure = result.dimensions.find(d => d.id === 'structure')
    expect(structure.status).toBe('mixed')
    expect(structure.lean).toBe(null)
    expect(structure.summary).toContain('not evidence')
    expect(result.contextualVariations.length).toBeLessThanOrEqual(2)
  })
  it('retains equally prominent tendencies instead of choosing the first array entry', () => {
    expect(buildResult(all('a')).primaryDimensions).toHaveLength(6)
  })
  it('updates the result after changing a choice', () => {
    expect(buildResult({ ...all(), q01: 'b' })).not.toEqual(buildResult(all()))
  })
  it('recognises structured and client-led work without declaring a contradiction', () => {
    const answers = all('a')
    for (const q of therapistQuestions) {
      const matching = q.options.find(o => o.weights.direction === 2 && (o.weights.structure === undefined || o.weights.structure === -2))
      if (matching) answers[q.id] = matching.id
    }
    expect(buildResult(answers).integrations.some(i => i.id === 'structured_and_client_led')).toBe(true)
  })
  it.each([null, [], {}, { ...all(), q01: 'unknown' }, { ...all(), extra: 'a' }, { ...all(), q01: 2 }])('rejects malformed answers %#', answers => {
    expect(() => validateAnswers(answers)).toThrow()
  })
  it('does not expose numeric positions or clinical confidence in the narrative input', () => {
    const result = buildResult(all())
    expect(result.disclaimer).toBe(DISCLAIMER)
    for (const dimension of result.dimensions) {
      expect(dimension).not.toHaveProperty('position')
      expect(dimension).not.toHaveProperty('confidence')
    }
  })
  it('always has a local fixed-wording report, even with no usable evidence', () => {
    const fallback = buildFallbackReport(buildResult(all(CONTEXT_ANSWER)))
    expect(fallback.sections.map(s => s.id)).toEqual(reportSections.map(s => s.id))
    expect(fallback.sections.every(s => s.paragraphs.length)).toBe(true)
  })
})

describe('report validation and provider request', () => {
  const result = buildResult(all())
  it('requires every named section and known evidence references', () => {
    expect(validateReport(validGenerated(result), result).sections).toHaveLength(9)
    const invalid = validGenerated(result)
    invalid.stance.evidenceIds = ['invented']
    expect(() => validateReport(invalid, result)).toThrow()
  })
  it('rejects missing sections, empty prose and explicit forbidden claims', () => {
    const missing = validGenerated(result); delete missing.identity
    expect(() => validateReport(missing, result)).toThrow()
    const empty = validGenerated(result); empty.stance.paragraphs = []
    expect(() => validateReport(empty, result)).toThrow()
    const unsafe = validGenerated(result); unsafe.stance.paragraphs = ['You are definitely this type.']
    expect(() => validateReport(unsafe, result)).toThrow()
  })
  it('uses a strict schema with no additional properties', () => {
    const schema = reportSchema(result)
    expect(schema.additionalProperties).toBe(false)
    expect(schema.required).toHaveLength(9)
    expect(schema.properties.stance.additionalProperties).toBe(false)
  })
  it('makes one provider call with only the deterministic result and instructions', async () => {
    const fetchImpl = vi.fn(async () => ({ ok: true, json: async () => ({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(validGenerated(result)) } }] }) }))
    await generateReport(result, { apiKey: 'test-only', fetchImpl })
    expect(fetchImpl).toHaveBeenCalledTimes(1)
    const body = JSON.parse(fetchImpl.mock.calls[0][1].body)
    expect(body.store).toBe(false)
    expect(body.response_format.json_schema.strict).toBe(true)
    expect(JSON.parse(body.messages[1].content)).toEqual(result)
    expect(body).not.toHaveProperty('email')
    expect(body).not.toHaveProperty('userId')
  })
  it.each([
    { finish_reason: 'length', message: { content: '{}' } },
    { finish_reason: 'stop', message: { refusal: 'No', content: null } },
    { finish_reason: 'stop', message: { content: 'not json' } }
  ])('rejects incomplete, refused or malformed responses %#', async choice => {
    const fetchImpl = async () => ({ ok: true, json: async () => ({ choices: [choice] }) })
    await expect(generateReport(result, { apiKey: 'test-only', fetchImpl })).rejects.toThrow()
  })
  it('aborts a slow provider request', async () => {
    const fetchImpl = (_, options) => new Promise((_, reject) => options.signal.addEventListener('abort', () => reject(new Error('aborted'))))
    await expect(generateReport(result, { apiKey: 'test-only', fetchImpl, timeoutMs: 5 })).rejects.toThrow('aborted')
  })
})

describe('new endpoint boundaries', () => {
  const enabled = { OPENAI_API_KEY: 'test-only', THERAPIST_REPORT_AI_ENABLED: 'true', VERCEL_ENV: 'preview' }
  it('does not enable production AI without explicit launch review', () => {
    expect(aiAvailable({ ...enabled, VERCEL_ENV: 'production' })).toBe(false)
    expect(aiAvailable({ ...enabled, VERCEL_ENV: 'production', THERAPIST_REPORT_PUBLIC_READY: 'true' })).toBe(true)
    expect(aiAvailable({ OPENAI_API_KEY: 'test-only' })).toBe(false)
  })
  it('returns a labelled fallback and never calls AI by default', async () => {
    const generate = vi.fn()
    const res = response()
    await createHandler({ env: {}, generate })(request(), res)
    expect(res.code).toBe(200)
    expect(res.data.mode).toBe('fallback')
    expect(res.data.reason).toBe('ai_not_enabled')
    expect(generate).not.toHaveBeenCalled()
    expect(res.headers['Cache-Control']).toBe('no-store')
  })
  it('never asks AI to manufacture a narrative from insufficient evidence', async () => {
    const generate = vi.fn()
    const res = response()
    await createHandler({ env: enabled, generate })(request({ body: { quizVersion: QUIZ_VERSION, consent: true, answers: all(CONTEXT_ANSWER) } }), res)
    expect(res.data.reason).toBe('insufficient_evidence')
    expect(generate).not.toHaveBeenCalled()
  })
  it('recomputes the result on the server and returns validated report output', async () => {
    const generate = vi.fn(async result => validateReport(validGenerated(result), result))
    const res = response()
    await createHandler({ env: enabled, generate })(request(), res)
    expect(res.code).toBe(200)
    expect(res.data.mode).toBe('ai')
    expect(generate.mock.calls[0][0]).toEqual(buildResult(all()))
  })
  it('rejects client-supplied profiles and personal data fields', async () => {
    for (const field of ['profile', 'email', 'userId', 'instructions']) {
      const req = request(); req.body[field] = 'not allowed'
      const res = response()
      await createHandler({ env: enabled })(req, res)
      expect(res.code).toBe(400)
    }
  })
  it('requires the matching version and explicit request consent', async () => {
    for (const body of [{ ...request().body, quizVersion: 'old' }, { ...request().body, consent: false }]) {
      const res = response()
      await createHandler({ env: enabled })(request({ body }), res)
      expect(res.code).toBe(400)
    }
  })
  it('rejects cross-origin, non-JSON, oversized and unsupported requests', async () => {
    for (const [req, code] of [
      [request({ headers: { 'content-type': 'application/json', origin: 'https://other.test', host: 'example.test' } }), 403],
      [request({ headers: { 'content-type': 'text/plain' } }), 415],
      [request({ body: 'x'.repeat(4097) }), 413],
      [request({ method: 'DELETE' }), 405]
    ]) {
      const res = response(); await createHandler({ env: enabled })(req, res); expect(res.code).toBe(code)
    }
  })
  it('returns a labelled fallback after provider failure', async () => {
    const res = response()
    await createHandler({ env: enabled, generate: async () => { throw new Error('provider failed') } })(request(), res)
    expect(res.code).toBe(200)
    expect(res.data.mode).toBe('fallback')
    expect(res.data.reason).toBe('generation_unavailable')
  })
  it('enforces the warm-instance throttle and allows later retries', () => {
    let time = 1000
    const allow = createWarmLimiter({ now: () => time, limit: 2, windowMs: 100 })
    expect(allow('a')).toBe(true); expect(allow('a')).toBe(true); expect(allow('a')).toBe(false)
    expect(allow('b')).toBe(true)
    time += 101
    expect(allow('a')).toBe(true)
  })
  it('does not call the provider when throttled', async () => {
    const generate = vi.fn()
    const res = response()
    await createHandler({ env: enabled, generate, allowRequest: () => false })(request(), res)
    expect(res.code).toBe(429)
    expect(res.headers['Retry-After']).toBe('60')
    expect(generate).not.toHaveBeenCalled()
  })
})

describe('replacement wiring', () => {
  it('routes old entry links to the new quiz without importing legacy quiz code', () => {
    const router = readFileSync(new URL('../../../router/index.js', import.meta.url), 'utf8')
    expect(router).toContain('/therapist-quiz')
    expect(router).toContain('/gateway')
    expect(router).not.toContain('InvestigationStarterView')
    expect(router).not.toContain('QuizGateway')
  })
  it('does not load session replay, checkout scripts or account hydration', () => {
    const html = readFileSync(new URL('../../../../index.html', import.meta.url), 'utf8')
    const main = readFileSync(new URL('../../../main.js', import.meta.url), 'utf8')
    expect(html).not.toContain('clarity.ms')
    expect(html).not.toContain('lemonsqueezy.com')
    expect(main).not.toContain('hydrateApp')
  })
  it('renders narrative text rather than arbitrary HTML', () => {
    const view = readFileSync(new URL('../../../views/TherapistQuizView.vue', import.meta.url), 'utf8')
    expect(view).toContain('{{ paragraph }}')
    expect(view).not.toContain('v-html')
    expect(view).not.toContain('capture-email')
    expect(view).not.toContain('localStorage')
  })
})
