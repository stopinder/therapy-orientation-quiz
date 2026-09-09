import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { readFileSync } from 'node:fs';
import TherapistStyleQuizView from '../../../views/TherapistStyleQuizView.vue';
import { therapistStyleRoute } from '../../../router/therapistStyleRoute.js';
import { therapistQuestions } from '../questions.js';
import { DISCLAIMER } from '../dimensions.js';
import { REPORT_HEADINGS } from '../reportContract.js';
import { useTherapistStyleQuiz } from '../ui/useTherapistStyleQuiz.js';
import { resolveReportAdapter } from '../ui/reportAdapter.js';

const reportFixture = () => ({
  ...Object.fromEntries(Object.keys(REPORT_HEADINGS).map(key => [key, { paragraphs: ['A UI test fixture, not an interpretation.'], evidenceIds: [] }])),
  reflectionQuestions: ['What feels familiar?', 'Where does context matter?']
});
function answerAll(quiz, contextOnly = false) {
  quiz.start();
  for (const question of therapistQuestions) {
    quiz.choose(contextOnly ? 'context_dependent' : question.options[0].value);
    quiz.next();
  }
}
const makeAdapter = generate => ({ kind: 'development-mock', generate });
afterEach(() => vi.useRealTimers());

describe('therapist-style UI state', () => {
  it('does not preselect, accept invalid choices or advance on a radio selection', () => {
    const quiz = useTherapistStyleQuiz();
    expect(quiz.stage.value).toBe('intro');
    expect(quiz.choose('offer_view')).toBe(false);
    quiz.start();
    expect(quiz.hasCurrentAnswer.value).toBe(false);
    expect(quiz.next()).toBe(false);
    expect(quiz.choose('made_up')).toBe(false);
    quiz.choose('offer_view');
    expect(quiz.questionIndex.value).toBe(0);
    expect(quiz.stage.value).toBe('questions');
    expect(quiz.hasCurrentAnswer.value).toBe(true);
  });

  it('retains selected answers through forward and back navigation', () => {
    const quiz = useTherapistStyleQuiz();
    quiz.start(); quiz.choose('weigh_together'); quiz.next();
    quiz.choose('history'); quiz.back();
    expect(quiz.answers.value.T01).toBe('weigh_together');
    quiz.next();
    expect(quiz.answers.value.T02).toBe('history');
    quiz.back(); quiz.back();
    expect(quiz.stage.value).toBe('intro');
    quiz.start();
    expect(quiz.answers.value.T01).toBe('weigh_together');
  });

  it('requires an explicit final action and never calls an absent report connection', async () => {
    const quiz = useTherapistStyleQuiz();
    answerAll(quiz);
    expect(quiz.stage.value).toBe('review');
    expect(quiz.complete.value).toBe(true);
    expect(quiz.report.value).toBeNull();
    expect(quiz.canGenerate.value).toBe(false);
    expect(await quiz.generate()).toBe(false);
    expect(quiz.error.value).toMatch(/not connected/);
    expect(Object.keys(quiz.answers.value)).toHaveLength(15);
  });

  it('passes an answer snapshot and validates the returned contract', async () => {
    const generate = vi.fn(async snapshot => {
      snapshot.T01 = 'changed_by_adapter';
      return reportFixture();
    });
    const quiz = useTherapistStyleQuiz({ getAdapter: () => makeAdapter(generate) });
    answerAll(quiz);
    expect(generate).not.toHaveBeenCalled();
    expect(await quiz.generate()).toBe(true);
    expect(generate).toHaveBeenCalledTimes(1);
    expect(quiz.answers.value.T01).toBe('offer_view');
    expect(quiz.report.value).toEqual(reportFixture());
    expect(quiz.profile.value.schemaVersion).toBe('therapist-style-v1');
    quiz.editAnswers();
    expect(quiz.stage.value).toBe('questions');
    expect(quiz.questionIndex.value).toBe(14);
    expect(quiz.report.value).toBeNull();
  });

  it('retains context-only answers without manufacturing an identity', async () => {
    const quiz = useTherapistStyleQuiz({ getAdapter: () => makeAdapter(async () => reportFixture()) });
    answerAll(quiz, true);
    await quiz.generate();
    expect(quiz.profile.value.primaryTendencies).toEqual([]);
    expect(quiz.profile.value.limitedEvidence).toBe(true);
    expect(quiz.profile.value.optionalLabel).toBeNull();
  });

  it('recovers from a rejected report request without losing answers', async () => {
    const generate = vi.fn().mockRejectedValueOnce(new Error('provider details must not appear')).mockResolvedValue(reportFixture());
    const quiz = useTherapistStyleQuiz({ getAdapter: () => makeAdapter(generate) });
    answerAll(quiz);
    const before = { ...quiz.answers.value };
    expect(await quiz.generate()).toBe(false);
    expect(quiz.stage.value).toBe('review');
    expect(quiz.error.value).not.toMatch(/provider details/);
    expect(quiz.answers.value).toEqual(before);
    expect(await quiz.generate()).toBe(true);
    expect(quiz.error.value).toBe('');
  });

  it('rejects malformed narrative and unknown evidence instead of showing a fallback', async () => {
    const invalid = reportFixture();
    invalid.expertise.evidenceIds = ['invented'];
    const quiz = useTherapistStyleQuiz({ getAdapter: () => makeAdapter(async () => invalid) });
    answerAll(quiz);
    expect(await quiz.generate()).toBe(false);
    expect(quiz.report.value).toBeNull();
    expect(quiz.stage.value).toBe('review');
    expect(quiz.answers.value.T15).toBe(therapistQuestions[14].options[0].value);
  });

  it('allows only one outstanding report request', async () => {
    let resolve;
    const generate = vi.fn(() => new Promise(done => { resolve = done; }));
    const quiz = useTherapistStyleQuiz({ getAdapter: () => makeAdapter(generate) });
    answerAll(quiz);
    const first = quiz.generate();
    expect(await quiz.generate()).toBe(false);
    expect(generate).toHaveBeenCalledTimes(1);
    resolve(reportFixture());
    expect(await first).toBe(true);
  });

  it('ignores a late response after cancellation and preserves the answers', async () => {
    let resolve;
    const quiz = useTherapistStyleQuiz({ getAdapter: () => makeAdapter(() => new Promise(done => { resolve = done; })) });
    answerAll(quiz);
    const pending = quiz.generate();
    await Promise.resolve();
    quiz.editAnswers();
    resolve(reportFixture());
    expect(await pending).toBe(false);
    expect(quiz.stage.value).toBe('questions');
    expect(quiz.report.value).toBeNull();
    expect(Object.keys(quiz.answers.value)).toHaveLength(15);
  });

  it('times out even if an adapter ignores abort', async () => {
    vi.useFakeTimers();
    const quiz = useTherapistStyleQuiz({ getAdapter: () => makeAdapter(() => new Promise(() => {})), timeoutMs: 20 });
    answerAll(quiz);
    const pending = quiz.generate();
    await vi.advanceTimersByTimeAsync(25);
    expect(await pending).toBe(false);
    expect(quiz.error.value).toMatch(/timed out/);
    expect(quiz.stage.value).toBe('review');
    expect(Object.keys(quiz.answers.value)).toHaveLength(15);
  });

  it('explicit reset clears the local preview completely', () => {
    const quiz = useTherapistStyleQuiz();
    answerAll(quiz); quiz.reset();
    expect(quiz.answers.value).toEqual({});
    expect(quiz.stage.value).toBe('intro');
    expect(quiz.questionIndex.value).toBe(0);
    expect(quiz.report.value).toBeNull();
  });
});

describe('isolated view and adapter boundary', () => {
  it('requires explicit development injection and rejects every production adapter', () => {
    const adapter = makeAdapter(vi.fn());
    expect(resolveReportAdapter(null, true)).toBeNull();
    expect(resolveReportAdapter(adapter, true)).toBe(adapter);
    expect(resolveReportAdapter(adapter, false)).toBeNull();
    expect(resolveReportAdapter({ kind: 'live', generate: vi.fn() }, false)).toBeNull();
    expect(resolveReportAdapter({ kind: 'development-mock' }, true)).toBeNull();
  });

  it('defines a lazy standalone route without weakening any existing gateway', () => {
    expect(therapistStyleRoute.path).toBe('/therapist-style');
    expect(therapistStyleRoute.meta).toEqual({ standalone: true });
    expect(typeof therapistStyleRoute.component).toBe('function');
    const router = readFileSync(new URL('../../../router/index.js', import.meta.url), 'utf8');
    expect(router).toContain('to.meta.requiresGateway');
    expect(router).toContain('to.meta.requiresAuth');
    expect(router).toContain('to.meta.requiresCourseAccess');
  });

  it('renders the introduction and disclaimer without a marketing or email gate', async () => {
    const html = await renderToString(createSSRApp(TherapistStyleQuizView));
    expect(html).toContain('What kind of therapist are you?');
    expect(html).toContain(DISCLAIMER);
    expect(html).toContain('Begin the reflection');
    expect(html).not.toContain('type="email"');
    expect(html).not.toContain('Development sample enabled');
    expect(html).not.toContain('href="/gateway"');
  });

  it('keeps report output escaped and the fixture behind the compile-time dev guard', () => {
    const source = readFileSync(new URL('../../../views/TherapistStyleQuizView.vue', import.meta.url), 'utf8');
    expect(source).not.toContain('v-html');
    expect(source).toContain('if (!import.meta.env.DEV');
    expect(source).toContain("import('../quiz/therapist/ui/developmentReportAdapter.js')");
    expect(source).not.toContain('/api/expand-report');
    expect(source).not.toContain('/api/capture-email');
  });
});
