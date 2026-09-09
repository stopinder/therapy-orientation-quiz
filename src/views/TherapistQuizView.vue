<template>
  <div class="cpd-reflection">
    <a class="skip-link" href="#quiz-main">Skip to content</a>
    <main id="quiz-main" class="page" :aria-busy="busy">
      <div class="exercise-context no-print">
        <p>CPD <span aria-hidden="true">/</span> Practice reflection</p>
        <small>Preview · not saved to your CPD history</small>
      </div>

      <section v-if="stage === 'intro'" class="intro">
        <h1 ref="focusTarget" tabindex="-1">Your therapeutic stance</h1>
        <p class="lead">A reflection on how you work, at this point in your practice.</p>
        <p>Fifteen situations invite you to notice your usual starting points, possible strengths and questions to take into supervision. This is one snapshot for continuing professional development, not a separate identity or a type to adopt.</p>
        <div class="notice"><p>{{ DISCLAIMER }}</p><p>{{ BOUNDARY_NOTE }}</p></div>
        <p>Choose what is most characteristic of your first response, not every response you might eventually use. All options assume appropriate consent, safety, scope of practice and attention to the particular client. There is no professionally superior answer.</p>
        <p class="muted">For qualified and trainee therapists. The questions and interpretation rules remain a draft for review. No client information is required. In this preview, choices stay in page memory unless you request an AI reflection; refreshing clears them. Nothing is automatically added to your main app.</p>
        <label class="consent"><input v-model="acknowledged" type="checkbox" /><span>I am taking this as a reflection on my practice or training, not as an assessment of competence.</span></label>
        <button type="button" class="primary" :disabled="!acknowledged" @click="start">Begin reflection <span aria-hidden="true">→</span></button>
      </section>

      <section v-else-if="stage === 'quiz'" class="question-screen">
        <div class="progress-row"><span>Situation {{ questionIndex + 1 }} of {{ therapistQuestions.length }}</span><span data-testid="answered-count">{{ progress.answered }} answered</span></div>
        <progress :value="progress.answered" :max="therapistQuestions.length" aria-label="Questions answered"></progress>
        <p class="eyebrow">{{ currentQuestion.title }}</p>
        <form @submit.prevent="nextQuestion">
          <fieldset :key="currentQuestion.id" aria-describedby="answer-help answer-feedback">
            <legend ref="focusTarget" tabindex="-1">{{ currentQuestion.text }}</legend>
            <p id="answer-help" class="muted helper">Choose your usual first move, or use the final option when you cannot choose. You can change your answers before reading the reflection.</p>
            <label v-for="option in visibleOptions" :key="`${currentQuestion.id}.${option.id}`" class="option" :class="{ selected: answers[currentQuestion.id] === option.id }">
              <input type="radio" :name="currentQuestion.id" :value="option.id" :checked="answers[currentQuestion.id] === option.id" @change="selectAnswer(currentQuestion.id, option.id)" />
              <span>{{ option.text }}</span>
            </label>
            <label class="option context-option" :class="{ selected: answers[currentQuestion.id] === CONTEXT_ANSWER }">
              <input type="radio" :name="currentQuestion.id" :value="CONTEXT_ANSWER" :checked="answers[currentQuestion.id] === CONTEXT_ANSWER" @change="selectAnswer(currentQuestion.id, CONTEXT_ANSWER)" />
              <span>{{ CONTEXT_LABEL }}<small>You can continue. This does not contribute to a tendency.</small></span>
            </label>
          </fieldset>
          <p id="answer-feedback" class="answer-feedback" :class="{ 'has-error': questionError }" aria-live="polite">{{ questionError || (currentAnswered ? 'Response recorded. You can continue.' : 'Select a response to continue.') }}</p>
          <div class="actions">
            <button type="button" class="secondary" @click="previousQuestion">{{ editing ? 'Back to review' : questionIndex === 0 ? 'Introduction' : 'Back' }}</button>
            <button class="primary" type="submit" data-testid="continue-button">{{ editing ? 'Return to review' : questionIndex === therapistQuestions.length - 1 ? 'Review my choices' : 'Continue' }} <span aria-hidden="true">→</span></button>
          </div>
        </form>
      </section>

      <section v-else-if="stage === 'review'">
        <h1 ref="focusTarget" tabindex="-1">Review your choices</h1>
        <p>You can revisit any situation. Contrasting choices are retained rather than forced into a single therapist type.</p>
        <p class="completion-message" role="status">{{ progress.complete ? 'All 15 situations have a response. Your reflection is ready to read.' : `${progress.missing.length} situations still need a response. Use Change to revisit them.` }}</p>
        <div class="review-list">
          <div v-for="(question, index) in therapistQuestions" :key="question.id" class="review-row">
            <div><h2>{{ index + 1 }}. {{ question.title }}</h2><p>{{ selectedText(question) }}</p></div>
            <button type="button" class="text-button" :aria-label="`Change answer to ${question.title}`" :disabled="busy" @click="editQuestion(index)">Change</button>
          </div>
        </div>
        <div class="notice"><p>{{ DISCLAIMER }}</p></div>
        <section class="generation-panel" aria-labelledby="read-reflection-title">
          <h2 id="read-reflection-title">Read your reflection</h2>
          <p>The question-based reflection uses authored wording and is created in your browser. It remains available without AI.</p>
          <button type="button" class="primary" :disabled="busy || !progress.complete" @click="showQuestionBasedReport">Read reflection</button>
          <p v-if="!availabilityChecked" class="muted availability" role="status">Checking the optional AI-writing service… You do not need to wait to read your reflection.</p>
          <p v-else-if="!canUseAI" class="muted availability">AI writing is not enabled in this preview. The button above opens your question-based reflection.</p>
          <div v-if="canUseAI" class="ai-option">
            <h3>Optional AI-written narrative</h3>
            <p>AI can develop the same structured result into a longer narrative. It does not score you or compare you with earlier reflections.</p>
            <label class="consent"><input v-model="aiConsent" type="checkbox" :disabled="busy" /><span>I agree to send my quiz choice IDs to this app’s server so a structured result can be sent to OpenAI to write this reflection.</span></label>
            <p class="muted">No email, account details or free-text clinical material is included. This preview does not save reports to the app’s database. Hosting and AI-provider processing policies still apply; this is not a promise of zero provider retention.</p>
            <button type="button" class="secondary" :disabled="busy || !aiConsent || !progress.complete" @click="requestAIReport">{{ busy ? 'Writing your reflection…' : 'Generate AI reflection' }}</button>
            <p v-if="!aiConsent" class="muted availability">Select the consent box to enable AI writing. It is optional.</p>
          </div>
          <p v-if="busy" role="status" aria-live="polite">Your choices are preserved while the report is being written.</p>
        </section>
      </section>

      <article v-else-if="stage === 'report' && report && result" class="report">
        <h1 ref="focusTarget" tabindex="-1">A reflection on your therapeutic stance</h1>
        <p class="report-label">{{ mode === 'ai' ? 'AI-written narrative from your structured responses' : 'Question-based reflection · authored wording, not AI-generated' }}</p>
        <p v-if="notice" class="notice" role="status">{{ notice }}</p>
        <div class="notice boundary"><p>{{ DISCLAIMER }}</p><p>{{ BOUNDARY_NOTE }}</p></div>
        <p class="muted">This reflects your choices in hypothetical situations at one point in time, not an observation of your practice. Possible strengths, trade-offs and client experiences are invitations to check, not findings.</p>
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
        <p class="muted continuation-note">You can keep this alongside your other CPD reflections and revisit it later. This preview does not yet save to, or analyse, your longitudinal history.</p>
        <div class="actions no-print">
          <button type="button" class="secondary" @click="reviewAgain">Review my choices</button>
          <button type="button" class="primary" @click="downloadReport">Save reflection as text</button>
        </div>
      </article>
      <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { therapistQuestions, QUIZ_VERSION, CONTEXT_ANSWER, CONTEXT_LABEL } from '../quiz/therapist/questions.js'
import { DISCLAIMER, BOUNDARY_NOTE, reportSections } from '../quiz/therapist/content.js'
import { buildResult, buildFallbackReport } from '../quiz/therapist/buildResult.js'
import { answerProgress, isAnswered } from '../quiz/therapist/progress.js'

const stage = ref('intro')
const acknowledged = ref(false)
const questionIndex = ref(0)
const editing = ref(false)
const questionError = ref('')
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
const currentAnswered = computed(() => isAnswered(currentQuestion.value, answers[currentQuestion.value.id]))
const progress = computed(() => answerProgress(answers))
// Presentation order does not change stable answer IDs or scoring.
const visibleOptions = computed(() => {
  const options = currentQuestion.value.options
  const offset = questionIndex.value % options.length
  return [...options.slice(offset), ...options.slice(0, offset)]
})

async function focusHeading() {
  await nextTick()
  focusTarget.value?.focus({ preventScroll: true })
  window.scrollTo({ top: 0, behavior: 'auto' })
}
function start() {
  if (!acknowledged.value) return
  editing.value = false
  stage.value = 'quiz'
  focusHeading()
}
function selectAnswer(questionId, value) {
  const question = therapistQuestions.find(item => item.id === questionId)
  if (!question || !isAnswered(question, value)) return
  answers[questionId] = value
  questionError.value = ''
}
function nextQuestion() {
  if (!currentAnswered.value) {
    questionError.value = 'Choose a response, or select “I cannot choose a usual response” to continue.'
    return
  }
  questionError.value = ''
  if (editing.value || questionIndex.value === therapistQuestions.length - 1) {
    editing.value = false
    stage.value = 'review'
  } else questionIndex.value += 1
  focusHeading()
}
function previousQuestion() {
  questionError.value = ''
  if (editing.value) { editing.value = false; stage.value = 'review' }
  else if (questionIndex.value > 0) questionIndex.value -= 1
  else stage.value = 'intro'
  focusHeading()
}
function editQuestion(index) {
  if (busy.value) return
  report.value = null
  result.value = null
  errorMessage.value = ''
  questionError.value = ''
  notice.value = ''
  questionIndex.value = index
  editing.value = true
  stage.value = 'quiz'
  focusHeading()
}
function selectedText(question) {
  return answers[question.id] === CONTEXT_ANSWER ? CONTEXT_LABEL : question.options.find(o => o.id === answers[question.id])?.text || 'No answer yet.'
}
function showQuestionBasedReport() {
  if (busy.value || !progress.value.complete) return
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
  if (busy.value || !aiConsent.value || !canUseAI.value || !progress.value.complete) return
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
      : 'An AI narrative was not available. Your choices have been preserved and this authored reflection is shown instead.'
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
    'CPD — Practice reflection: your therapeutic stance',
    mode.value === 'ai' ? 'AI-written reflective narrative' : 'Question-based reflection — authored wording, not AI-generated',
    DISCLAIMER, BOUNDARY_NOTE,
    ...report.value.sections.flatMap(section => [section.title, ...section.paragraphs]),
    result.value.quizVersion, result.value.reportVersion
  ].join('\n\n')
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'cpd-practice-reflection.txt'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
onMounted(async () => {
  document.title = 'CPD · Practice reflection'
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

<style scoped src="../quiz/therapist/reflection.css"></style>
