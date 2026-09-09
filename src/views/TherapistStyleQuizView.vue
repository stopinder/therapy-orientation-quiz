<template>
  <div class="ts-shell" :data-stage="stage">
    <a class="ts-skip" href="#ts-main">Skip to the reflection</a>
    <header class="ts-masthead">
      <span class="ts-wordmark">Therapist <em>style.</em></span>
      <span class="ts-masthead-note">An open question, not a verdict</span>
    </header>

    <main id="ts-main" class="ts-main">
      <details v-if="development" class="ts-dev" data-testid="development-tools">
        <summary>Development preview tools</summary>
        <p>No AI request, saving or Helios handoff is connected. Enable a labelled layout sample to test the report screen.</p>
        <label class="ts-dev-checkbox">
          <input v-model="failFirst" type="checkbox" :disabled="Boolean(adapter) || enablingMock" />
          Simulate a failed first report request
        </label>
        <button class="ts-button ts-button-small ts-button-outline" type="button" :disabled="Boolean(adapter) || enablingMock" @click="enableMock">
          {{ adapter ? 'Sample reports enabled' : enablingMock ? 'Enabling sample…' : 'Enable sample report' }}
        </button>
        <p v-if="mockError" role="alert">{{ mockError }}</p>
      </details>
      <p v-if="adapter" class="ts-preview-notice" role="status">Development sample enabled · not an AI report · nothing is saved</p>

      <section v-if="stage === 'intro'" class="ts-intro" aria-labelledby="ts-title">
        <div class="ts-intro-copy">
          <p class="ts-eyebrow">A little room for reflection</p>
          <h1 id="ts-title" ref="focusTarget" tabindex="-1">{{ QUIZ_INTRO }}</h1>
          <p class="ts-lede">Not the school you trained in. Not the way you ought to work. The inclinations you bring into the room.</p>
          <p class="ts-body">Fifteen familiar moments from therapeutic work. A chance to notice what draws your attention, what you tend to offer, and where your preferences meet.</p>
          <div class="ts-intro-action">
            <button type="button" class="ts-button ts-button-primary" @click="start">Begin the reflection <span aria-hidden="true">↗</span></button>
            <span class="ts-small">15 scenarios. No right answers.</span>
          </div>
        </div>
        <aside class="ts-note-card" aria-label="Before you begin">
          <div class="ts-orbit" aria-hidden="true"><span></span><i></i></div>
          <p class="ts-eyebrow">Before you begin</p>
          <h2>Choose what feels closest.</h2>
          <p>{{ QUIZ_GUIDANCE }}</p>
          <p class="ts-note-foot">For qualified and trainee therapists. A snapshot, not a fixed identity.</p>
        </aside>
        <div class="ts-disclaimer ts-intro-disclaimer">{{ DISCLAIMER }}</div>
        <p class="ts-small ts-intro-disclaimer">This preview keeps answers only in this page’s memory. Reloading or leaving clears them. Report generation and return to Helios are not connected yet.</p>
      </section>

      <section v-else-if="stage === 'questions'" class="ts-question-page">
        <div class="ts-progress-copy"><p class="ts-eyebrow">A moment in the room</p><p data-testid="question-progress">{{ questionIndex + 1 }} of {{ therapistQuestions.length }}</p></div>
        <progress class="ts-progress" :value="questionIndex + 1" :max="therapistQuestions.length" :aria-valuetext="`Scenario ${questionIndex + 1} of ${therapistQuestions.length}`" aria-label="Question position"></progress>
        <form @submit.prevent="next">
          <fieldset :key="currentQuestion.id" class="ts-fieldset" aria-describedby="ts-choice-guidance">
            <legend ref="focusTarget" tabindex="-1"><h1>{{ currentQuestion.text }}</h1></legend>
            <p id="ts-choice-guidance" class="ts-choice-guidance">Choose the closest inclination. You can go back and change it.</p>
            <div class="ts-options">
              <label v-for="(option, index) in currentQuestion.options" :key="option.value" class="ts-option" :class="{ 'ts-option-selected': answers[currentQuestion.id] === option.value, 'ts-option-context': option.unscored }">
                <input type="radio" :name="currentQuestion.id" :value="option.value" :checked="answers[currentQuestion.id] === option.value" @change="choose(option.value)" />
                <span class="ts-option-letter" aria-hidden="true">{{ option.unscored ? '↔' : String.fromCharCode(65 + index) }}</span>
                <span class="ts-option-copy">{{ option.label }}</span>
              </label>
            </div>
          </fieldset>
          <div class="ts-navigation">
            <button type="button" class="ts-button ts-button-outline" @click="back"><span aria-hidden="true">←</span> Back</button>
            <button type="submit" class="ts-button ts-button-primary" :disabled="!hasCurrentAnswer">{{ questionIndex === therapistQuestions.length - 1 ? 'Review answers' : 'Next' }} <span aria-hidden="true">→</span></button>
          </div>
        </form>
        <p class="ts-quiet-note">Context matters. A preference is not a rule for practice.</p>
      </section>

      <section v-else-if="stage === 'review'" class="ts-reading" aria-labelledby="ts-review-title">
        <p class="ts-eyebrow">All fifteen moments considered</p>
        <h1 id="ts-review-title" ref="focusTarget" tabindex="-1">A pause before your reflection.</h1>
        <p class="ts-lede">Your choices are a starting point for curiosity, not a conclusion about how you practise.</p>
        <div v-if="error" class="ts-error" role="alert" data-testid="report-error"><strong>The report is not ready.</strong><p>{{ error }}</p></div>
        <div v-if="!canGenerate" class="ts-connection-note">{{ REPORT_UNAVAILABLE_MESSAGE }}</div>
        <p v-else class="ts-connection-note">You are about to open a development layout sample, not a personalised AI report. The real report connection is a later step.</p>
        <details class="ts-review-answers">
          <summary>Review your {{ therapistQuestions.length }} choices</summary>
          <ol>
            <li v-for="item in selectedAnswers" :key="item.id"><h2>{{ item.question }}</h2><p>{{ item.label }}</p></li>
          </ol>
        </details>
        <div class="ts-navigation">
          <button type="button" class="ts-button ts-button-outline" @click="editAnswers">Review my answers</button>
          <button type="button" class="ts-button ts-button-primary" :disabled="!canGenerate" @click="generate">{{ canGenerate ? (error ? 'Try sample report again' : 'Create sample report') : 'Create reflection' }} <span aria-hidden="true">↗</span></button>
        </div>
        <p class="ts-small">Nothing is saved or sent to Helios from this preview.</p>
      </section>

      <section v-else-if="stage === 'loading'" class="ts-reading ts-loading" aria-busy="true" aria-labelledby="ts-loading-title">
        <p class="ts-eyebrow">Development preview</p>
        <h1 id="ts-loading-title" ref="focusTarget" tabindex="-1">Making room for the reflection.</h1>
        <p role="status" class="ts-lede">Preparing the sample report layout. No AI request is being made.</p>
        <div class="ts-loading-line" aria-hidden="true"></div>
        <button class="ts-button ts-button-outline" type="button" @click="editAnswers">Back to my answers</button>
      </section>

      <article v-else-if="stage === 'report' && report" class="ts-reading ts-report" aria-labelledby="ts-report-title">
        <header class="ts-report-header">
          <p class="ts-eyebrow">A reflection to hold lightly</p>
          <h1 id="ts-report-title" ref="focusTarget" tabindex="-1">A way of being<br /><em>in the room.</em></h1>
          <p class="ts-preview-notice">Development sample — not a personalised AI report. Nothing has been saved.</p>
          <p class="ts-lede">The finished reflection will invite recognition, disagreement and a little more curiosity.</p>
        </header>
        <section v-for="([key, heading], index) in narrativeSections" :key="key" class="ts-report-section" :aria-labelledby="`ts-section-${key}`">
          <span class="ts-section-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          <div><h2 :id="`ts-section-${key}`">{{ heading }}</h2><p v-for="(paragraph, paragraphIndex) in report[key].paragraphs" :key="paragraphIndex">{{ paragraph }}</p></div>
        </section>
        <section class="ts-reflection-questions" aria-labelledby="ts-reflection-questions-title">
          <p class="ts-eyebrow">Something to carry with you</p>
          <h2 id="ts-reflection-questions-title">Questions for your reflection</h2>
          <ol><li v-for="(question, index) in report.reflectionQuestions" :key="index">{{ question }}</li></ol>
        </section>
        <section class="ts-identity" aria-labelledby="ts-identity-title"><h2 id="ts-identity-title">{{ REPORT_HEADINGS.identityDescription }}</h2><p v-for="(paragraph, index) in report.identityDescription.paragraphs" :key="index">{{ paragraph }}</p></section>
        <div class="ts-disclaimer">{{ DISCLAIMER }}</div>
        <div class="ts-connection-note">Return to Helios, keeping this reflection and mapping permission are not connected in this UI slice. This sample is not a saved reflection.</div>
        <div class="ts-navigation"><button type="button" class="ts-button ts-button-outline" @click="editAnswers">Review my answers</button><button type="button" class="ts-button ts-button-outline" @click="reset">Clear this preview</button></div>
      </article>
      <footer class="ts-footer"><p>Reflection, not classification.</p><p v-if="stage !== 'intro' && stage !== 'report'">{{ DISCLAIMER }}</p></footer>
    </main>
  </div>
</template>

<script setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import { DISCLAIMER } from '../quiz/therapist/dimensions.js';
import { QUIZ_GUIDANCE, QUIZ_INTRO, therapistQuestions } from '../quiz/therapist/questions.js';
import { REPORT_HEADINGS } from '../quiz/therapist/reportContract.js';
import { REPORT_UNAVAILABLE_MESSAGE, THERAPIST_REPORT_ADAPTER, resolveReportAdapter } from '../quiz/therapist/ui/reportAdapter.js';
import { useTherapistStyleQuiz } from '../quiz/therapist/ui/useTherapistStyleQuiz.js';

const development = import.meta.env.DEV;
const adapter = shallowRef(resolveReportAdapter(inject(THERAPIST_REPORT_ADAPTER, null)));
const failFirst = ref(false);
const enablingMock = ref(false);
const mockError = ref('');
const focusTarget = ref(null);
let disposed = false;
let previousTitle = '';
const {
  stage, questionIndex, answers, currentQuestion, hasCurrentAnswer, canGenerate,
  error, report, start, choose, next, back, generate, cancelGeneration, editAnswers, reset
} = useTherapistStyleQuiz({ getAdapter: () => adapter.value });

const narrativeSections = Object.entries(REPORT_HEADINGS).filter(([key]) => key !== 'identityDescription');
const selectedAnswers = computed(() => therapistQuestions.map(question => ({
  id: question.id,
  question: question.text,
  label: question.options.find(option => option.value === answers.value[question.id])?.label || 'Not selected'
})));

async function enableMock() {
  if (!import.meta.env.DEV || enablingMock.value || adapter.value) return;
  enablingMock.value = true;
  mockError.value = '';
  try {
    // Dynamic import inside the compile-time guard: fixture code is absent from
    // standard production builds, not merely hidden behind a query parameter.
    const { createDevelopmentReportAdapter } = await import('../quiz/therapist/ui/developmentReportAdapter.js');
    if (!disposed) adapter.value = resolveReportAdapter(createDevelopmentReportAdapter({ failFirst: failFirst.value }));
  } catch {
    if (!disposed) mockError.value = 'The development sample could not be loaded. Try again.';
  } finally {
    if (!disposed) enablingMock.value = false;
  }
}

async function focusCurrent() {
  await nextTick();
  if (disposed || !focusTarget.value) return;
  focusTarget.value.focus({ preventScroll: true });
  // Intentional navigation only. Radio changes do not trigger this watcher.
  focusTarget.value.scrollIntoView({ block: 'start', behavior: 'auto' });
}
watch([stage, questionIndex], focusCurrent, { flush: 'post' });
onMounted(() => {
  previousTitle = document.title;
  document.title = QUIZ_INTRO;
  focusCurrent();
});
onBeforeUnmount(() => {
  disposed = true;
  cancelGeneration();
  document.title = previousTitle;
});
</script>

<style scoped>
.ts-shell { --ts-paper: #f8f5ef; --ts-ink: #282634; --ts-muted: #625e68; --ts-plum: #583a55; --ts-teal: #285f5b; --ts-line: #d7d0c8; background: var(--ts-paper); color: var(--ts-ink); min-height: 100vh; font-family: ui-sans-serif, system-ui, sans-serif; }
.ts-shell *, .ts-shell *::before, .ts-shell *::after { box-sizing: border-box; }
.ts-shell h1, .ts-shell h2, .ts-shell p { margin: 0; }
.ts-shell button, .ts-shell summary, .ts-shell input { font: inherit; }
.ts-shell :focus-visible { outline: 3px solid var(--ts-teal); outline-offset: 5px; }
.ts-shell [tabindex='-1'] { scroll-margin-top: 1.5rem; }
.ts-shell [tabindex='-1']:focus:not(:focus-visible) { outline: none; }
.ts-skip { position: absolute; left: 1rem; top: -10rem; z-index: 100; background: white; padding: 1rem; color: var(--ts-ink); }
.ts-skip:focus { top: 1rem; }
.ts-masthead { max-width: 1200px; margin: 0 auto; padding: 1.6rem clamp(1rem, 4vw, 3.5rem); display: flex; gap: 1rem; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--ts-line); }
.ts-wordmark { font-size: 1.15rem; letter-spacing: -.04em; font-weight: 650; }
.ts-wordmark em { font-family: Georgia, serif; color: var(--ts-plum); font-size: 1.3em; font-weight: 400; }
.ts-masthead-note { font-size: .75rem; color: var(--ts-muted); }
.ts-main { max-width: 1140px; margin: 0 auto; padding: 1.8rem clamp(1rem, 4vw, 3.5rem) 2rem; }
.ts-eyebrow { color: var(--ts-teal); font-size: .72rem; letter-spacing: .14em; text-transform: uppercase; font-weight: 700; line-height: 1.6; }
.ts-intro { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(240px, .85fr); gap: 2rem 4rem; align-items: center; padding-top: 2rem; }
.ts-intro h1 { font: 400 clamp(2.8rem, 5.8vw, 4.7rem)/1.06 Georgia, 'Times New Roman', serif; letter-spacing: -.045em; max-width: 13ch; margin: 1.2rem 0 1.6rem; }
.ts-lede { color: var(--ts-ink); font-size: clamp(1.05rem, 2vw, 1.2rem); line-height: 1.7; }
.ts-body { margin-top: 1rem !important; color: var(--ts-muted); font-size: .95rem; line-height: 1.8; max-width: 52ch; }
.ts-intro-action { margin-top: 2rem; display: flex; align-items: center; flex-wrap: wrap; gap: 1rem; }
.ts-small { font-size: .8rem; line-height: 1.7; color: var(--ts-muted); }
.ts-button { min-height: 48px; padding: .8rem 1.25rem; border-radius: .7rem; border: 1px solid transparent; display: inline-flex; justify-content: center; align-items: center; gap: 1rem; font-size: .9rem !important; font-weight: 600 !important; cursor: pointer; transition: background-color .15s, border-color .15s; text-align: center; }
.ts-button-primary { background: var(--ts-plum); color: #fffaf7; }
.ts-button-primary:hover:not(:disabled) { background: #43283f; }
.ts-button-outline { border-color: var(--ts-line); color: var(--ts-ink); background: transparent; }
.ts-button-outline:hover:not(:disabled) { border-color: var(--ts-plum); background: #efe9ed; }
.ts-button:disabled { cursor: not-allowed; background: #e4dfda; color: #716b75; border-color: #ddd5ce; }
.ts-button-small { min-height: 40px; padding: .55rem .8rem; }
.ts-note-card { align-self: center; padding: 2rem; background: #edeae1; border-radius: 7rem 7rem 1rem 1rem; border: 1px solid #ddd8ce; }
.ts-note-card h2 { font: 400 1.7rem/1.2 Georgia, serif; margin: .6rem 0 1rem; letter-spacing: -.02em; }
.ts-note-card p:not(.ts-eyebrow) { font-size: .84rem; line-height: 1.8; color: var(--ts-muted); }
.ts-note-card .ts-note-foot { border-top: 1px solid #d1cbc0; padding-top: 1rem; margin-top: 1rem; }
.ts-orbit { height: 100px; width: 120px; position: relative; margin: 0 auto 1.5rem; }
.ts-orbit::before, .ts-orbit::after, .ts-orbit span { content: ''; position: absolute; width: 65px; height: 80px; border: 1px solid var(--ts-teal); border-radius: 50%; top: 5px; left: 25px; transform: rotate(-35deg); }
.ts-orbit::after { transform: rotate(35deg); border-color: var(--ts-plum); }
.ts-orbit span { transform: rotate(90deg); }
.ts-orbit i { position: absolute; width: 8px; height: 8px; background: var(--ts-plum); border-radius: 50%; left: 96px; top: 63px; }
.ts-disclaimer { border-left: 2px solid var(--ts-teal); padding: .1rem 0 .1rem 1rem; font-size: .8rem; line-height: 1.8; color: var(--ts-muted); }
.ts-intro-disclaimer { grid-column: 1 / -1; max-width: 80ch; }
.ts-dev { font-size: .8rem; line-height: 1.7; color: var(--ts-muted); border: 1px dashed #b6aa9e; border-radius: .5rem; padding: .7rem 1rem; margin-bottom: 1rem; }
.ts-dev summary { cursor: pointer; color: var(--ts-ink); font-weight: 600; }
.ts-dev p { margin: .6rem 0; }
.ts-dev-checkbox { display: flex; gap: .6rem; align-items: center; margin: .75rem 0; min-height: 40px; }
.ts-dev input { accent-color: var(--ts-teal); width: 18px; height: 18px; }
.ts-preview-notice { color: #533c17; border: 1px solid #d9c9a9; background: #f4eddf; font-size: .78rem; line-height: 1.7; padding: .65rem 1rem; border-radius: .5rem; margin-bottom: 1.2rem !important; }
.ts-question-page { max-width: 760px; margin: 1.5rem auto 0; }
.ts-progress-copy { display: flex; justify-content: space-between; align-items: center; font-size: .85rem; gap: 1rem; }
.ts-progress { display: block; height: 3px; border: 0; width: 100%; background: #e3ddd5; color: var(--ts-teal); accent-color: var(--ts-teal); margin: .9rem 0 2.5rem; }
.ts-progress::-webkit-progress-bar { background: #e3ddd5; }
.ts-progress::-webkit-progress-value { background: var(--ts-teal); }
.ts-progress::-moz-progress-bar { background: var(--ts-teal); }
.ts-fieldset { border: 0; padding: 0; margin: 0; min-width: 0; }
.ts-fieldset legend { float: none; display: block; width: 100%; padding: 0; }
.ts-fieldset h1 { font: 400 clamp(1.6rem, 3vw, 2.2rem)/1.3 Georgia, serif; letter-spacing: -.025em; }
.ts-choice-guidance { font-size: .84rem; color: var(--ts-muted); line-height: 1.7; margin: 1rem 0 1.6rem !important; }
.ts-options { display: grid; gap: .65rem; }
.ts-option { display: grid; grid-template-columns: 20px 24px minmax(0, 1fr); gap: .9rem; align-items: center; border: 1px solid var(--ts-line); border-radius: .75rem; background: #fffdfa; padding: 1rem 1.2rem; cursor: pointer; transition: border-color .15s, background-color .15s; min-height: 68px; }
.ts-option:hover { border-color: var(--ts-plum); }
.ts-option:focus-within { outline: 3px solid var(--ts-teal); outline-offset: 3px; }
.ts-option input { accent-color: var(--ts-plum); width: 19px; height: 19px; margin: 0; }
.ts-option-letter { color: #716575; font-family: Georgia, serif; font-size: .95rem; }
.ts-option-copy { font-size: .95rem; line-height: 1.6; }
.ts-option-selected { border: 2px solid var(--ts-plum); padding: calc(1rem - 1px) calc(1.2rem - 1px); background: #eee5ed; }
.ts-option-context { background: transparent; border-style: dashed; }
.ts-option-context.ts-option-selected { background: #eee5ed; border-style: solid; }
.ts-navigation { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; margin: 1.7rem 0 1rem; }
.ts-quiet-note { text-align: center; color: var(--ts-muted); font-size: .8rem; line-height: 1.7; margin-top: 1.7rem !important; }
.ts-reading { max-width: 760px; margin: 2.5rem auto 0; }
.ts-reading > h1, .ts-report-header h1 { font: 400 clamp(2rem, 4.5vw, 3.6rem)/1.13 Georgia, serif; letter-spacing: -.035em; margin: .8rem 0 1.4rem; }
.ts-report-header h1 em { color: var(--ts-plum); font-weight: 400; }
.ts-connection-note { background: #eceee8; border-radius: .7rem; color: #3d514b; font-size: .87rem; line-height: 1.8; padding: 1rem 1.2rem; margin: 1.5rem 0; }
.ts-error { background: #f7e9e7; border: 1px solid #cba29b; border-radius: .7rem; padding: 1rem 1.2rem; color: #713d37; font-size: .9rem; line-height: 1.7; margin-top: 1.5rem; }
.ts-error p { margin-top: .4rem; }
.ts-review-answers { border-top: 1px solid var(--ts-line); border-bottom: 1px solid var(--ts-line); padding: 1rem 0; margin-top: 1.5rem; font-size: .9rem; }
.ts-review-answers summary { cursor: pointer; padding: .4rem 0; font-weight: 600; }
.ts-review-answers ol { padding-left: 1.4rem; }
.ts-review-answers li { margin: 1.5rem 0; padding-left: .5rem; }
.ts-review-answers h2 { font-size: .95rem; line-height: 1.6; font-weight: 600; }
.ts-review-answers p { color: var(--ts-muted); margin-top: .4rem; line-height: 1.7; }
.ts-loading { min-height: 45vh; padding: 2rem 0; }
.ts-loading-line { height: 2px; margin: 2rem 0; background: linear-gradient(90deg, var(--ts-teal), #dfd6db, var(--ts-plum)); }
.ts-report-section { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 1rem; padding: 1.8rem 0; border-bottom: 1px solid var(--ts-line); }
.ts-section-number { color: var(--ts-teal); font-size: .75rem; padding-top: .4rem; letter-spacing: .08em; }
.ts-report h2 { font: 400 clamp(1.3rem, 2.3vw, 1.7rem)/1.35 Georgia, serif; letter-spacing: -.02em; }
.ts-report-section p, .ts-identity p { font-size: 1rem; line-height: 1.9; color: var(--ts-muted); margin-top: .8rem; white-space: pre-line; overflow-wrap: anywhere; }
.ts-reflection-questions { margin: 2rem 0; padding: 1.6rem; background: #eceee8; border-radius: 1rem; }
.ts-reflection-questions h2 { margin-top: .5rem; }
.ts-reflection-questions ol { padding-left: 1.4rem; margin: 1.2rem 0 0; }
.ts-reflection-questions li { padding-left: .4rem; margin: .9rem 0; font-size: 1rem; line-height: 1.8; overflow-wrap: anywhere; }
.ts-identity { margin: 2rem 0; }
.ts-footer { border-top: 1px solid var(--ts-line); margin-top: 3.5rem; padding-top: 1.2rem; color: var(--ts-muted); font-size: .75rem; line-height: 1.7; }
.ts-footer p + p { margin-top: .6rem; max-width: 90ch; }
@media (max-width: 760px) { .ts-intro { grid-template-columns: 1fr; gap: 1.7rem; padding-top: .7rem; } .ts-intro h1 { max-width: 16ch; } .ts-note-card { border-radius: 1rem; padding: 1.4rem; } .ts-orbit { display: none; } .ts-intro-disclaimer { grid-column: auto; } .ts-main { padding-top: 1rem; } .ts-masthead-note { max-width: 13ch; text-align: right; line-height: 1.5; } .ts-progress { margin-bottom: 1.7rem; } }
@media (max-width: 420px) { .ts-option { grid-template-columns: 19px minmax(0, 1fr); gap: .8rem; padding: .9rem; } .ts-option-selected { padding: calc(.9rem - 1px); } .ts-option-letter { display: none; } .ts-navigation .ts-button { flex: 1 1 auto; } .ts-report-section { grid-template-columns: 1fr; gap: .5rem; } }
@media (prefers-reduced-motion: reduce) { .ts-shell *, .ts-shell *::before, .ts-shell *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }
</style>
