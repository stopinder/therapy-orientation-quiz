import { describe, it, expect } from 'vitest'
import { computed, reactive } from 'vue'
import { readFileSync } from 'node:fs'
import { answerProgress, isAnswered } from '../progress.js'
import { therapistQuestions, CONTEXT_ANSWER } from '../questions.js'
import { buildResult } from '../buildResult.js'

// Deliberately evaluate while empty, just as the mounted page does. Testing only
// a pre-filled plain object would miss the stale-completion regression.
describe('reactive questionnaire completion', () => {
  it('updates after every selection, including the last question', () => {
    const answers = reactive({})
    const progress = computed(() => answerProgress(answers))
    expect(progress.value.answered).toBe(0)
    expect(progress.value.complete).toBe(false)
    therapistQuestions.forEach((question, index) => {
      answers[question.id] = question.options[0].id
      expect(progress.value.answered).toBe(index + 1)
      expect(progress.value.complete).toBe(index === therapistQuestions.length - 1)
    })
    expect(progress.value.missing).toEqual([])
  })
  it.each(['a', 'b', 'c', 'd', CONTEXT_ANSWER])('allows final answer %s to complete the flow', lastChoice => {
    const answers = reactive({})
    const progress = computed(() => answerProgress(answers))
    expect(progress.value.complete).toBe(false)
    for (const question of therapistQuestions.slice(0, -1)) answers[question.id] = 'a'
    expect(progress.value.answered).toBe(14)
    expect(progress.value.complete).toBe(false)
    answers.q15 = lastChoice
    expect(progress.value.answered).toBe(15)
    expect(progress.value.complete).toBe(true)
    expect(() => buildResult({ ...answers })).not.toThrow()
  })
  it('permits all-context completion without creating a default tendency', () => {
    const answers = reactive({})
    const progress = computed(() => answerProgress(answers))
    expect(progress.value.answered).toBe(0)
    for (const question of therapistQuestions) answers[question.id] = CONTEXT_ANSWER
    expect(progress.value.complete).toBe(true)
    expect(buildResult({ ...answers }).primaryDimensions).toEqual([])
  })
  it('tracks changing, removing and restoring an earlier answer', () => {
    const answers = reactive(Object.fromEntries(therapistQuestions.map(q => [q.id, 'a'])))
    const progress = computed(() => answerProgress(answers))
    expect(progress.value.complete).toBe(true)
    answers.q01 = 'b'
    expect(progress.value.answered).toBe(15)
    delete answers.q01
    expect(progress.value.complete).toBe(false)
    expect(progress.value.missing.map(q => q.id)).toEqual(['q01'])
    answers.q01 = CONTEXT_ANSWER
    expect(progress.value.complete).toBe(true)
  })
  it('does not accept an invalid value or an extra property as completion', () => {
    const answers = reactive({ extra: 'a', q01: 'invalid' })
    expect(answerProgress(answers).answered).toBe(0)
    expect(isAnswered(therapistQuestions[0], undefined)).toBe(false)
  })
})

describe('CPD presentation', () => {
  const view = readFileSync(new URL('../../../views/TherapistQuizView.vue', import.meta.url), 'utf8')
  const css = readFileSync(new URL('../reflection.css', import.meta.url), 'utf8')
  it('has no separate product brand or marketing shell', () => {
    expect(view).not.toContain('MindWorks')
    expect(view).not.toContain('site-header')
    expect(view).not.toContain('site-footer')
    expect(view).toContain('Practice reflection')
    expect(view).toContain('not saved to your CPD history')
  })
  it('uses tracked completion and explains an unanswered question instead of a dead disabled CTA', () => {
    expect(view).toContain('computed(() => answerProgress(answers))')
    expect(view).not.toContain('Object.hasOwn(answers')
    const next = view.match(/<button[^>]*data-testid="continue-button"[^>]*>/)?.[0]
    expect(next).toBeTruthy()
    expect(next).not.toContain('disabled')
    expect(view).toContain('id="answer-feedback"')
  })
  it('inherits main-app colours and fonts without defining a global theme', () => {
    expect(css).toContain('var(--surface-canvas, #F4F0E7)')
    expect(css).toContain('var(--surface-muted, #ECE7DD)')
    expect(css).toContain('var(--action-primary, #1D546D)')
    expect(css).toContain('var(--border-reflection-tag, #5F9598)')
    expect(css).toContain('var(--font-editorial, Newsreader, Georgia, serif)')
    expect(css).not.toContain(':root')
    expect(css).not.toContain('fonts.googleapis.com')
  })
})
