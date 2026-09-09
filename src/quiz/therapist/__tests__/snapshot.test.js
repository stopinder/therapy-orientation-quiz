import { describe, it, expect } from 'vitest'
import { therapistQuestions, CONTEXT_ANSWER } from '../questions.js'
import { buildResult, buildFallbackReport } from '../buildResult.js'
import { createReflectionSnapshot, validateReflectionSnapshot, reflectionText, canonicalJSON } from '../snapshot.js'

const answers = Object.fromEntries(therapistQuestions.map(q => [q.id, 'a']))
const options = () => ({ id: '11111111-1111-4111-8111-111111111111', completedAt: '2026-09-09T18:00:00.000Z', answers,
  report: buildFallbackReport(buildResult(answers)), mode: 'fallback' })

describe('dated private reflection snapshot', () => {
  it('keeps source choices, deterministic interpretation and narrative distinguishable', () => {
    const snapshot = createReflectionSnapshot(options())
    expect(snapshot.responses).toEqual(answers)
    expect(snapshot.interpretation).toEqual(buildResult(answers))
    expect(snapshot.provenance.interpretation).toContain('unvalidated')
    expect(snapshot.continuity.status).toBe('not_analysed')
    expect(snapshot.continuity.requiresExplicitSelection).toBe(true)
    expect(snapshot).not.toHaveProperty('user_id')
    expect(snapshot).not.toHaveProperty('email')
    expect(snapshot.narrative.promptVersion).toBeNull()
    expect(snapshot.narrative.model).toBeNull()
  })
  it('is unchanged across retries and validates after JSONB reorders keys', () => {
    const snapshot = createReflectionSnapshot(options())
    const reordered = Object.fromEntries(Object.entries(snapshot).reverse())
    expect(validateReflectionSnapshot(reordered)).toEqual(snapshot)
    expect(validateReflectionSnapshot(JSON.parse(JSON.stringify(snapshot)))).toEqual(snapshot)
    expect(canonicalJSON(reordered)).toBe(canonicalJSON(snapshot))
  })
  it('refuses unsupported versions, hidden fields and forged deterministic evidence', () => {
    for (const mutate of [s => { s.scoringVersion = 'other' }, s => { s.extra = 'not allowed' },
      s => { s.interpretation.dimensions[0].summary = 'You are definitely this type' }]) {
      const snapshot = createReflectionSnapshot(options()); mutate(snapshot)
      expect(() => validateReflectionSnapshot(snapshot)).toThrow()
    }
  })
  it('refuses invalid identity, completion date, choices and report structure', () => {
    for (const patch of [{ id: 'not-a-uuid' }, { completedAt: 'invalid' }, { answers: {} }, { report: {} }, { mode: 'diagnosis' }]) {
      expect(() => createReflectionSnapshot({ ...options(), ...patch })).toThrow()
    }
  })
  it('labels downloaded authored prose, date and versions without asserting AI analysis', () => {
    const text = reflectionText(createReflectionSnapshot(options()))
    expect(text).toContain('not AI-generated')
    expect(text).toContain('2026-09-09T18:00:00.000Z')
    expect(text).toContain('Question version:')
    expect(text).toContain('Saving does not trigger AI analysis.')
  })
  it('permits a sparse snapshot without manufacturing a primary tendency', () => {
    const sparse = Object.fromEntries(therapistQuestions.map(q => [q.id, CONTEXT_ANSWER]))
    const result = buildResult(sparse)
    const snapshot = createReflectionSnapshot({ ...options(), answers: sparse, report: buildFallbackReport(result) })
    expect(snapshot.interpretation.primaryDimensions).toEqual([])
  })
})
