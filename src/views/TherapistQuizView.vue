<template>
  <div class="therapist-app">
    <a class="skip-link" href="#quiz-main">Skip to content</a>
    <header class="site-header no-print">
      <span class="brand">MindWorks <span>/ reflection</span></span>
      <span class="edition">Development preview</span>
    </header>

    <main id="quiz-main" class="page" :aria-busy="busy">
      <section v-if="stage === 'intro'" class="intro">
        <p class="eyebrow">For qualified and trainee therapists</p>
        <h1>What kind of therapist<br class="wide-only" /> are you?</h1>
        <p class="lead">Not a type to fit into.<br />A way to think about how you work.</p>
        <p>Explore the choices you tend to make when there is more than one useful way forward. Fifteen situations invite reflection on your therapeutic stance, its possible strengths and the questions it may bring into supervision.</p>
        <div class="notice"><p>{{ DISCLAIMER }}</p><p>{{ BOUNDARY_NOTE }}</p></div>
        <p>Choose what is most characteristic of your first response, not every response you might eventually use. All options assume appropriate consent, safety, scope of practice and attention to the particular client. There is no professionally superior answer.</p>
        <p class="muted">Questions and interpretation rules are a draft for review. No account, email address or client information is required. Your choices remain in this page’s memory unless you explicitly request an AI reflection; refreshing the page clears them.</p>
        <label class="consent"><input v-model="acknowledged" type="checkbox" /><span>I am taking this as a reflection on my practice or training, not as an assessment of competence.</span></label>
        <button class="primary" :disabled="!acknowledged" @click="start">Begin the reflection <span aria-hidden="true">→</span></button>
      </section>

      <section v-else-if="stage === 'quiz'" class="question-screen">
        <div class="progress-row"><span>Situation {{ questionIndex + 1 }} of {{ therapistQuestions.length }}</span><span>{{ answeredCount }} answered</span></div>
        <progress :value="answeredCount" :max="therapistQuestions.length" aria-label="Questions answered"></progress>
        <p class="eyebrow">{{ currentQuestion.title }}</p>
        <form @submit.prevent="nextQuestion">
          <fieldset>
            <legend ref="focusTarget" tabindex="-1">{{ currentQuestion.text }}</legend>
            <p class="muted helper">Choose the first move most characteristic of you. You can change it later.</p>
            <label v-for="option in visibleOptions" :key="option.id" class="option" :class="{ selected: answers[currentQuestion.id] === option.id }">
              <input v-model="answers[currentQuestion.id]" type="radio" :name="currentQuestion.id" :value="option.id" />
              <span>{{ option.text }}</span>
            </label>
            <label class="option context-option" :class="{ selected: answers[currentQuestion.id] === CONTEXT_ANSWER }">
              <input v-model="answers[currentQuestion.id]" type="radio" :name="currentQuestion.id" :value="CONTEXT_ANSWER" />
              <span>{{ CONTEXT_LABEL }}<small>This is treated as missing evidence, not a neutral score.</small></span>
            </label>
          </fieldset>
          <div class="actions">
            <button type="button" class="secondary" @click="previousQuestion">{{ questionIndex === 0 ? 'Introduction' : 'Back' }}</button>
            <button class="primary" type="submit" :disabled="!answers[currentQuestion.id]">{{ questionIndex === therapistQuestions.length - 1 ? 'Review my choices' : 'Continue' }} <span aria-hidden="true">→</span></button>
          </div>
        </form>
      </section>

      <section v-else-if="stage === 'review'">
        <p class="eyebrow">Before your reflection</p>
        <h1 ref="focusTarget" tabindex="-1" class="section-title">Your choices, together.</h1>
        <p>You can revisit any situation before reading your reflection. Contrasting choices are retained rather than forced into a single therapist type.</p>
        <div class="review-list">
          <div v-for="(question, index) in therapistQuestions" :key="question.id" class="review-row">
            <div><h2>{{ index + 1 }}. {{ question.title }}</h2><p>{{ selectedText(question) }}</p></div>
            <button class="text-button" :aria-label="`Change answer to ${question.title}`" :disabled="busy" @click="editQuestion(index)">Change</button>
          </div>
        </div>
        <div class="notice"><p>{{ DISCLAIMER }}</p></div>
        <div class="generation-panel">
          <h2>Choose how to read your reflection</h2>
          <p>The question-based version uses fixed, reviewed-in-code wording and is created in your browser. The AI-written version develops the same structured result into a longer narrative; it does not score you.</p>
          <p v-if="!availabilityChecked" class="muted" role="status">Checking whether AI reflection is enabled…</p>
          <p v-else-if="!canUseAI" class="muted">AI generation is not enabled in this preview. The question-based reflection is available now. This is not an AI-generated report.</p>
          <template v-if="canUseAI">
            <label class="consent"><input v-model="aiConsent" type="checkbox" :disabled="busy" /><span>I agree to send my quiz choice IDs to this app’s server so a structured, non-identifying result can be sent to OpenAI to write the reflection. I will not enter client information.</span></label>
            <p class="muted">No email address, account details or free-text clinical material is included. The new report endpoint does not save reports to the app’s database. Hosting and AI-provider processing policies still apply; this is not a promise of zero provider retention.</p>
          </template>
          <div class="actions generation-actions">
            <button class="secondary" :disabled="busy || !complete" @click="showQuestionBasedReport">Read question-based reflection</button>
            <button v-if="canUseAI" class="primary" :disabled="busy || !aiConsent || !complete" @click="requestAIReport">{{ busy ? 'Writing your reflection…' : 'Generate AI reflection' }}</button>
          </div>
          <p v-if="busy" role="status" aria-live="polite">Your choices are preserved while the report is being written.</p>
        </div>
      </section>

      <article v-else-if="stage === 'report' && report && result" class="report">
        <p class="eyebrow">What kind of therapist are you?</p>
        <h1 ref="focusTarget" tabindex="-1" class="section-title">A reflection on your<br class="wide-only" /> therapeutic stance.</h1>
        <p class="report-label">{{ mode === 'ai' ? 'AI-written narrative from your structured quiz result' : 'Question-based reflection · fixed wording, not AI-generated' }}</p>
        <p v-if="notice" class="notice" role="status">{{ notice }}</p>
        <div class="notice boundary"><p>{{ DISCLAIMER }}</p><p>{{ BOUNDARY_NOTE }}</p></div>
        <p class="muted">This reflects choices in hypothetical situations, not an observation of your practice. Possible strengths, trade-offs and client experiences are invitations to check, not findings.</p>
        <section v-for="section in report.sections" :key="section.id" class="report-section" :aria-labelledby="`section-${section.id}`">
          <h2 :id="`section-${section.id}`">{{ section.title }}</h2>
          <p v-for="(paragraph, index) in section.paragraphs" :key="index">{{ paragraph }}</p>
        </section>
        <details class="evidence no-print">
          <summary>What this reflection is based on</summary>
          <p>Each tendency comes from fixed answer rules. These are provisional editorial rules, not validated measures. No numerical clinical score is being reported.</p>
          <div v-for="dimension in result.dimensions" :key="dimension.id"><h3>{{ dimension.label }}</h3><p>{{ dimension.summary }}</p></div>
          <h3>Your selected approaches</h3>
          <div v-for="item in result.evidence" :key="item.id"><h4>{{ item.scenario }}</h4><p>{{ item.selectedApproach }}</p></div>
          <p v-if="result.omittedQuestions.length">Some situations were left without a usual response. They did not contribute to a tendency.</p>
          <p class="muted">{{ result.quizVersion }} · {{ result.reportVersion }}</p>
        </details>
        <div class="actions no-print">
          <button class="secondary" @click="reviewAgain">Review my choices</button>
          <button class="primary" @click="downloadReport">Save reflection as text</button>
        </div>
      </article>
      <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
    </main>
    <footer class="site-footer"><p>Reflection, not classification.</p><p>Draft content for clinical and editorial review.</p></footer>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { therapistQuestions, QUIZ_VERSION, CONTEXT_ANSWER, CONTEXT_LABEL } from '../quiz/therapist/questions.js'
import { DISCLAIMER, BOUNDARY_NOTE, reportSections } from '../quiz/therapist/content.js'
import { buildResult, buildFallbackReport } from '../quiz/therapist/buildResult.js'

const stage = ref('intro')
const acknowledged = ref(false)
const questionIndex = ref(0)
const answers = reactive({})
const aiConsent = ref(false)
const busy = ref(false)
const canUseAI = ref(false)
const availabilityChecked = ref(false)
const errorMessage = ref('')
const notice = ref('')
const mode = ref('fallback')
const result = ref(null)
const report = ref(null)
const focusTarget = ref(null)
let requestController = null
let statusController = null
let active = true
const currentQuestion = computed(() => therapistQuestions[questionIndex.value])
// Stable rotations avoid always putting the same scoring direction first. Answer IDs never change.
const visibleOptions = computed(() => {
  const options = currentQuestion.value.options
  const offset = questionIndex.value % options.length
  return [...options.slice(offset), ...options.slice(0, offset)]
})
const answeredCount = computed(() => therapistQuestions.filter(q => Object.hasOwn(answers, q.id)).length)
const complete = computed(() => answeredCount.value === therapistQuestions.length)

async function focusHeading() {
  await nextTick()
  focusTarget.value?.focus({ preventScroll: true })
  window.scrollTo({ top: 0, behavior: 'auto' })
}
function start() { if (acknowledged.value) { stage.value = 'quiz'; focusHeading() } }
function nextQuestion() {
  if (!answers[currentQuestion.value.id]) return
  if (questionIndex.value < therapistQuestions.length - 1) questionIndex.value += 1
  else stage.value = 'review'
  focusHeading()
}
function previousQuestion() {
  if (questionIndex.value > 0) questionIndex.value -= 1
  else stage.value = 'intro'
  focusHeading()
}
function editQuestion(index) {
  if (busy.value) return
  report.value = null
  result.value = null
  errorMessage.value = ''
  notice.value = ''
  questionIndex.value = index
  stage.value = 'quiz'
  focusHeading()
}
function selectedText(question) {
  return answers[question.id] === CONTEXT_ANSWER ? CONTEXT_LABEL : question.options.find(o => o.id === answers[question.id])?.text || 'No answer yet.'
}
function showQuestionBasedReport() {
  if (busy.value || !complete.value) return
  errorMessage.value = ''
  result.value = buildResult({ ...answers })
  report.value = buildFallbackReport(result.value)
  mode.value = 'fallback'
  notice.value = result.value.sufficientForNarrative ? '' : 'There is not enough evidence for a developed narrative. The reflection below makes those limits explicit instead of assigning a default type.'
  stage.value = 'report'
  focusHeading()
}
function validReportShape(value) {
  return Array.isArray(value?.sections) && value.sections.length === reportSections.length && value.sections.every((section, i) =>
    section.id === reportSections[i].id && section.title === reportSections[i].title && Array.isArray(section.paragraphs) &&
    section.paragraphs.length > 0 && section.paragraphs.every(p => typeof p === 'string' && p.length <= 3500))
}
async function requestAIReport() {
  if (busy.value || !aiConsent.value || !canUseAI.value || !complete.value) return
  busy.value = true
  errorMessage.value = ''
  notice.value = ''
  const snapshot = { ...answers }
  const expected = buildResult(snapshot)
  requestController = new AbortController()
  const timer = setTimeout(() => requestController?.abort(), 50000)
  try {
    const response = await fetch('/api/therapist-report', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      signal: requestController.signal,
      body: JSON.stringify({ quizVersion: QUIZ_VERSION, answers: snapshot, consent: true })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(response.status === 429 ? 'Please wait a minute before requesting another AI reflection. Your choices are unchanged.' : 'The AI reflection could not be requested. Your choices are unchanged; the question-based reflection remains available.')
    if (!validReportShape(data.report) || !['ai', 'fallback'].includes(data.mode) || JSON.stringify(data.result) !== JSON.stringify(expected)) throw new Error('The returned report could not be verified. Please use the question-based reflection or try again.')
    if (!active) return
    result.value = expected
    report.value = data.report
    mode.value = data.mode
    if (data.mode === 'fallback') notice.value = data.reason === 'insufficient_evidence'
      ? 'There is not enough evidence for an AI narrative. This is a question-based reflection, not an AI-generated report.'
      : 'An AI narrative was not available. Your choices have been preserved and this fixed-wording reflection is shown instead.'
    stage.value = 'report'
    focusHeading()
  } catch (error) {
    if (active) errorMessage.value = error.name === 'AbortError'
      ? 'The request took too long. Your choices are still here. You can read the question-based reflection or try again.'
      : error.message || 'The request failed. Your choices are still here.'
  } finally {
    clearTimeout(timer)
    requestController = null
    if (active) busy.value = false
  }
}
function reviewAgain() { stage.value = 'review'; errorMessage.value = ''; notice.value = ''; focusHeading() }
function downloadReport() {
  const text = [
    'What kind of therapist are you?',
    mode.value === 'ai' ? 'AI-written reflective narrative' : 'Question-based reflection — fixed wording, not AI-generated',
    DISCLAIMER, BOUNDARY_NOTE,
    ...report.value.sections.flatMap(section => [section.title, ...section.paragraphs]),
    result.value.quizVersion, result.value.reportVersion
  ].join('\n\n')
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'therapist-reflection.txt'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
onMounted(async () => {
  document.title = 'What kind of therapist are you?'
  statusController = new AbortController()
  const timer = setTimeout(() => statusController?.abort(), 4000)
  try {
    const response = await fetch('/api/therapist-report', { signal: statusController.signal, cache: 'no-store' })
    const data = await response.json()
    if (active) canUseAI.value = response.ok && data.quizVersion === QUIZ_VERSION && data.aiAvailable === true
  } catch { if (active) canUseAI.value = false }
  finally { clearTimeout(timer); statusController = null; if (active) availabilityChecked.value = true }
})
onBeforeUnmount(() => { active = false; requestController?.abort(); statusController?.abort() })
</script>

<style scoped>
.therapist-app{min-height:100vh;background:#f7f5ef;color:#263630;font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;line-height:1.7}
.site-header{max-width:1120px;margin:auto;padding:26px 32px;display:flex;justify-content:space-between;align-items:center;gap:16px;border-bottom:1px solid #dedfd5}
.brand{font-weight:700;font-size:19px;letter-spacing:-.02em}.brand span{font-weight:400;color:#657469}.edition{font-size:12px;background:#e9eee3;padding:5px 12px;border-radius:20px;color:#42563f}
.page{max-width:800px;padding:56px 28px 80px;margin:auto}.intro{max-width:690px}.eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:12px;font-weight:700;color:#5a6a51;margin:0 0 22px}
h1{font-family:Georgia,'Times New Roman',serif;font-size:clamp(38px,6vw,64px);line-height:1.09;font-weight:400;letter-spacing:-.045em;margin:0 0 30px}.section-title{font-size:clamp(34px,5vw,49px)}.lead{font-size:23px;line-height:1.5;color:#4d6153;margin-bottom:26px}p{margin:0 0 20px}h2{font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;margin:0 0 18px;font-weight:400}h3{font-weight:700;margin:24px 0 8px}h4{font-weight:600;margin:16px 0 6px}
.muted{font-size:14px;color:#5d6a61}.notice{background:#eef0e7;border-left:3px solid #718866;padding:18px 22px;margin:26px 0;font-size:14px}.notice p:last-child{margin-bottom:0}.consent{display:flex;align-items:flex-start;gap:12px;font-size:14px;margin:24px 0}.consent input{width:18px;height:18px;flex-shrink:0;margin-top:4px;accent-color:#385747}
button{font:inherit;cursor:pointer;transition:background .15s}.primary,.secondary{border:1px solid #355644;border-radius:9px;padding:12px 21px;min-height:48px;line-height:1.4;font-size:15px;font-weight:600}.primary{background:#355644;color:#fff;display:inline-flex;gap:28px;align-items:center;justify-content:center}.primary:hover:not(:disabled){background:#243f30}.secondary{background:transparent;color:#355644}.secondary:hover:not(:disabled){background:#e9eee3}button:disabled{opacity:.5;cursor:not-allowed}.actions{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;margin-top:28px}
.progress-row{display:flex;justify-content:space-between;gap:16px;color:#637164;font-size:13px}progress{display:block;width:100%;height:5px;margin:12px 0 38px;border:0;accent-color:#6a8660}progress::-webkit-progress-bar{background:#e0e5d9}progress::-webkit-progress-value{background:#6a8660}fieldset{border:0;padding:0;margin:0;min-width:0}legend{font-family:Georgia,'Times New Roman',serif;font-size:clamp(25px,4vw,32px);line-height:1.4;margin-bottom:16px;letter-spacing:-.015em}.helper{margin-bottom:22px}.option{display:flex;align-items:flex-start;gap:15px;padding:18px 20px;margin-bottom:12px;background:#fffdfa;border:1px solid #d9ded1;border-radius:10px;cursor:pointer;line-height:1.6}.option:hover{border-color:#79916c}.option.selected{border-color:#355644;background:#eaf0e4;box-shadow:0 0 0 1px #355644}.option input{width:18px;height:18px;flex-shrink:0;accent-color:#355644;margin-top:4px}.context-option{font-size:14px;background:transparent}.context-option small{display:block;font-size:12px;color:#667165;margin-top:3px}
.review-row{display:flex;align-items:flex-start;gap:24px;justify-content:space-between;padding:20px 0;border-bottom:1px solid #dfe3d8}.review-row h2{font:600 16px/1.5 Inter,ui-sans-serif,system-ui,sans-serif;margin:0 0 7px}.review-row p{font-size:14px;margin:0;color:#58675d}.text-button{border:0;background:transparent;color:#355644;font-size:14px;text-decoration:underline;padding:8px;min-height:44px}.generation-panel{padding:28px;background:#fffdfa;border:1px solid #d9ded1;border-radius:14px;margin-top:32px}.generation-panel p{font-size:14px}.generation-actions{align-items:stretch}.report-label{font-size:13px;color:#577047}.report-section{margin-top:44px;max-width:68ch}.report-section p{font-size:17px;line-height:1.9}.evidence{border-top:1px solid #d6ddcf;border-bottom:1px solid #d6ddcf;padding:22px 0;margin-top:40px;font-size:14px}.evidence summary{cursor:pointer;font-weight:600}.evidence summary+p{margin-top:20px}.error-message{background:#fff0e9;color:#853c25;border-left:3px solid #a85235;padding:18px;margin-top:24px}.site-footer{max-width:1120px;margin:auto;border-top:1px solid #dedfd5;padding:26px 32px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;font-size:12px;color:#667363}.site-footer p{margin:0}
:focus-visible{outline:3px solid #bc894d;outline-offset:4px}.skip-link{position:absolute;left:20px;top:-100px;background:#fff;padding:12px;z-index:10}.skip-link:focus{top:10px}
@media(max-width:600px){.site-header{padding:20px}.brand{font-size:16px}.brand span{display:none}.edition{font-size:11px}.page{padding:36px 20px 60px}.wide-only{display:none}.lead{font-size:21px}.option{padding:16px}.generation-panel{padding:20px}.generation-actions{flex-direction:column}.generation-actions button{width:100%}.site-footer{padding:22px 20px}.review-row{gap:12px}.report-section p{font-size:16px}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
@media print{.no-print,.site-header,.site-footer{display:none!important}.therapist-app{background:white;color:black}.page{max-width:none;padding:0}.report-section{break-inside:avoid}.notice{border:1px solid #aaa;background:white}}
</style>
