import { computed, ref, shallowRef } from 'vue';
import { therapistQuestions } from '../questions.js';
import { buildTherapistProfile } from '../buildTherapistProfile.js';
import { validateTherapistReport } from '../reportContract.js';
import { REPORT_UNAVAILABLE_MESSAGE } from './reportAdapter.js';

/** Local, disposable UI state. No storage, identity, URLs or network calls. */
export function useTherapistStyleQuiz({ getAdapter = () => null, timeoutMs = 15000 } = {}) {
  const stage = ref('intro');
  const questionIndex = ref(0);
  const answers = ref({});
  const error = ref('');
  const report = shallowRef(null);
  const reportKind = ref('');
  const profile = shallowRef(null);
  const currentQuestion = computed(() => therapistQuestions[questionIndex.value]);
  const hasCurrentAnswer = computed(() => currentQuestion.value.options.some(option => option.value === answers.value[currentQuestion.value.id]));
  const complete = computed(() => therapistQuestions.every(question => question.options.some(option => option.value === answers.value[question.id])));
  const canGenerate = computed(() => typeof getAdapter()?.generate === 'function');
  let requestSequence = 0;
  let activeController = null;

  function start() {
    if (stage.value !== 'intro') return;
    error.value = '';
    stage.value = 'questions';
  }

  function choose(value) {
    if (stage.value !== 'questions') return false;
    if (!currentQuestion.value.options.some(option => option.value === value)) return false;
    answers.value[currentQuestion.value.id] = value;
    error.value = '';
    // Selecting a radio does not advance the question or move focus.
    return true;
  }

  function next() {
    if (stage.value !== 'questions' || !hasCurrentAnswer.value) return false;
    if (questionIndex.value < therapistQuestions.length - 1) questionIndex.value += 1;
    else stage.value = 'review';
    return true;
  }

  function back() {
    if (stage.value === 'review') {
      error.value = '';
      questionIndex.value = therapistQuestions.length - 1;
      stage.value = 'questions';
    } else if (stage.value === 'questions') {
      if (questionIndex.value > 0) questionIndex.value -= 1;
      else stage.value = 'intro';
    }
  }

  function cancelGeneration() {
    requestSequence += 1;
    activeController?.abort();
    activeController = null;
    if (stage.value === 'loading') stage.value = 'review';
  }

  function editAnswers() {
    cancelGeneration();
    error.value = '';
    report.value = null;
    profile.value = null;
    reportKind.value = '';
    questionIndex.value = therapistQuestions.length - 1;
    stage.value = 'questions';
  }

  function reset() {
    cancelGeneration();
    answers.value = {};
    questionIndex.value = 0;
    report.value = null;
    profile.value = null;
    reportKind.value = '';
    error.value = '';
    stage.value = 'intro';
  }

  async function generate() {
    if (stage.value === 'loading' || !complete.value || stage.value !== 'review') return false;
    const adapter = getAdapter();
    if (typeof adapter?.generate !== 'function') {
      error.value = REPORT_UNAVAILABLE_MESSAGE;
      return false;
    }
    // Copy only canonical answer IDs; the adapter never receives mutable state.
    const snapshot = { ...answers.value };
    const canonicalProfile = buildTherapistProfile(snapshot);
    const request = ++requestSequence;
    const controller = new AbortController();
    activeController = controller;
    let timedOut = false;
    let rejectOnAbort;
    const aborted = new Promise((resolve, reject) => {
      rejectOnAbort = () => reject(new Error('Request cancelled'));
      controller.signal.addEventListener('abort', rejectOnAbort, { once: true });
    });
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    error.value = '';
    report.value = null;
    stage.value = 'loading';
    try {
      const result = await Promise.race([
        Promise.resolve().then(() => adapter.generate(snapshot, { signal: controller.signal })),
        aborted
      ]);
      if (request !== requestSequence) return false;
      const validated = validateTherapistReport(result, canonicalProfile);
      if (!validated) throw new Error('Invalid report structure');
      profile.value = canonicalProfile;
      report.value = validated;
      reportKind.value = adapter.kind;
      stage.value = 'report';
      return true;
    } catch {
      if (request !== requestSequence) return false;
      error.value = timedOut
        ? 'The report request timed out. Your answers are still here. You can retry or review them.'
        : 'The report could not be prepared or checked. Your answers are still here. You can retry or review them.';
      stage.value = 'review';
      return false;
    } finally {
      clearTimeout(timer);
      controller.signal.removeEventListener('abort', rejectOnAbort);
      if (activeController === controller) activeController = null;
    }
  }

  return {
    stage, questionIndex, answers, currentQuestion, hasCurrentAnswer, complete,
    canGenerate, error, report, reportKind, profile,
    start, choose, next, back, generate, cancelGeneration, editAnswers, reset
  };
}
