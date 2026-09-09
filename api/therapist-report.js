import { createHash, randomBytes } from 'node:crypto'
import { QUIZ_VERSION } from '../src/quiz/therapist/questions.js'
import { isPlainObject, QuizInputError } from '../src/quiz/therapist/scoring.js'
import { buildResult, buildFallbackReport } from '../src/quiz/therapist/buildResult.js'
import { generateReport } from '../server/therapistReport.js'

// A warm-instance throttle only. This is NOT a distributed public abuse-control system.
// AI stays disabled until explicitly enabled; production also needs a launch-review flag.
export function createWarmLimiter({ now = Date.now, limit = 3, windowMs = 60000 } = {}) {
  const buckets = new Map()
  const salt = randomBytes(16).toString('hex')
  return key => {
    const time = now()
    for (const [id, bucket] of buckets) if (bucket.resetAt <= time) buckets.delete(id)
    if (buckets.size > 5000) return false
    const id = createHash('sha256').update(salt + String(key)).digest('hex')
    const bucket = buckets.get(id) || { count: 0, resetAt: time + windowMs }
    if (bucket.count >= limit) return false
    bucket.count += 1
    buckets.set(id, bucket)
    return true
  }
}

export function aiAvailable(env) {
  return Boolean(env.OPENAI_API_KEY && env.THERAPIST_REPORT_AI_ENABLED === 'true' &&
    (env.VERCEL_ENV !== 'production' || env.THERAPIST_REPORT_PUBLIC_READY === 'true'))
}

export function createHandler({ env = process.env, generate = generateReport, allowRequest = createWarmLimiter() } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    if (req.method === 'GET') return res.status(200).json({ aiAvailable: aiAvailable(env), quizVersion: QUIZ_VERSION })
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST')
      return res.status(405).json({ error: 'Method not allowed.' })
    }
    const contentType = String(req.headers?.['content-type'] || '').split(';')[0].trim().toLowerCase()
    if (contentType !== 'application/json') return res.status(415).json({ error: 'Send answers as JSON.' })
    // Same-origin browser guard, not authentication. Deployment protection/WAF is still required for launch.
    try {
      const origin = new URL(String(req.headers?.origin || ''))
      const host = String(req.headers?.host || '')
      const expected = env.THERAPIST_APP_ORIGIN ? new URL(env.THERAPIST_APP_ORIGIN).origin : null
      if (!['http:', 'https:'].includes(origin.protocol) || (expected ? origin.origin !== expected : origin.host !== host)) throw new Error('Origin')
    } catch {
      return res.status(403).json({ error: 'Please open the questionnaire on this site before requesting a report.' })
    }
    let result
    try {
      const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
      if (typeof raw !== 'string' || Buffer.byteLength(raw, 'utf8') > 4096) return res.status(413).json({ error: 'The request is too large.' })
      const body = JSON.parse(raw)
      if (!isPlainObject(body) || Object.keys(body).sort().join(',') !== 'answers,consent,quizVersion') throw new QuizInputError('Unrecognised request fields.')
      if (body.quizVersion !== QUIZ_VERSION) throw new QuizInputError('This questionnaire has changed. Please reload it.')
      if (body.consent !== true) throw new QuizInputError('Please choose whether to request an AI reflection.')
      result = buildResult(body.answers)
    } catch (error) {
      return res.status(400).json({ error: error instanceof QuizInputError ? error.message : 'The answers could not be read.' })
    }
    const fallback = reason => res.status(200).json({ mode: 'fallback', reason, result, report: buildFallbackReport(result) })
    if (!result.sufficientForNarrative) return fallback('insufficient_evidence')
    if (!aiAvailable(env)) return fallback('ai_not_enabled')
    const client = req.headers?.['x-vercel-forwarded-for'] || req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
    if (!allowRequest(String(client).split(',')[0].trim())) {
      res.setHeader('Retry-After', '60')
      return res.status(429).json({ error: 'Please wait a minute before requesting another AI reflection.' })
    }
    try {
      const report = await generate(result, { apiKey: env.OPENAI_API_KEY, model: env.THERAPIST_REPORT_MODEL || 'gpt-4.1-mini' })
      return res.status(200).json({ mode: 'ai', result, report })
    } catch {
      // Do not log prompts, responses, answer IDs, names, email addresses or provider error bodies.
      return fallback('generation_unavailable')
    }
  }
}

export default createHandler()
