<template>
  <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 px-6 py-20">
    <div class="max-w-3xl mx-auto space-y-20">

      <!-- Quiz Header -->
      <header class="relative max-w-2xl pl-8 space-y-5">
        <span class="absolute left-0 top-1 h-14 w-1 rounded-sm bg-slate-500"></span>
        <p class="text-xs uppercase tracking-widest text-slate-500">Self-Check</p>
        <h1 class="text-4xl font-medium tracking-tight text-stone-800">
          ADHD Reflection Quiz
        </h1>
        <p class="text-lg leading-relaxed text-stone-600">
          This reflection helps you notice everyday patterns in attention, focus, and energy.
          It is not a diagnosis, but a structured psychological reflection.
        </p>
      </header>

      <!-- Progress -->
      <div class="sticky top-16 z-40 bg-stone-100 border-b border-stone-300">
        <div class="max-w-3xl mx-auto px-3 py-3 flex justify-between items-center">
          <span class="text-base font-semibold text-slate-900">Progress</span>
          <span class="text-sm font-semibold text-slate-800">
            {{ answeredCount }} / {{ totalCount }}
          </span>
        </div>
      </div>

      <!-- Quiz -->
      <section class="space-y-16 rounded-2xl bg-white/80 shadow-soft px-6 py-8">

        <div
            v-for="(question, index) in adhdQuestions"
            :key="question.id"
            class="space-y-6"
        >
          <p
              class="text-xl leading-relaxed text-stone-800 scroll-mt-28"
              :ref="el => questionTextRefs[index] = el"
          >
            {{ question.text }}
          </p>

          <div class="space-y-4">
            <label
                v-for="option in scale"
                :key="option.value"
                class="flex items-center justify-between px-6 py-4 rounded-xl bg-white/90 border border-stone-200 cursor-pointer"
            >
              <span class="text-base text-stone-700">
                {{ option.label }}
              </span>
              <input
                  type="radio"
                  :name="question.id"
                  :value="option.value"
                  :checked="answers[question.id] === option.value"
                  @change="handleAnswer(question.id, option.value, index)"
                  class="h-5 w-5 accent-slate-700"
              />
            </label>
          </div>
        </div>

        <!-- Generate Button -->
        <button
            ref="generateButtonRef"
            type="button"
            @click="generateOverview"
            class="mt-8 px-6 py-3 rounded-xl bg-slate-700 text-white scroll-mt-28"
        >
          {{ loading ? "Generating…" : "Generate Reflection" }}
        </button>
        <!-- Consent notice -->
        <p class="mt-3 text-xs text-slate-500 max-w-prose">
          By generating a reflection, you agree to the
          <router-link
              to="/terms"
              class="underline hover:text-slate-700"
          >
            Terms of Use
          </router-link>
          and
          <router-link
              to="/privacy"
              class="underline hover:text-slate-700"
          >
            Privacy Policy
          </router-link>.
        </p>

        <!-- Report -->
        <div
            v-if="activeText"
            ref="reportContainerRef"
            class="mt-12 max-w-prose mx-auto"
        >


        <!-- View Switcher -->
          <div class="flex gap-2 mb-8">
            <button
                v-for="view in views"
                :key="view.key"
                @click="selectView(view.key)"
                class="px-4 py-1.5 rounded-full text-sm border transition"
                :class="activeView === view.key
        ? 'bg-slate-700 text-white border-slate-700'
        : 'bg-white text-slate-700 border-stone-300 hover:bg-stone-50'"
            >
              {{ view.label }}
            </button>
          </div>

          <!-- Formatted Report -->
          <div v-html="formattedActiveText"></div>

          <!-- Feedback -->
          <div class="mt-8 text-sm text-slate-600">
            <p class="mb-2 italic">
              If you noticed anything that felt particularly accurate, unclear, or off-mark,
              I’d genuinely welcome hearing about it.
            </p>

            <a
                href="mailto:emdrifs@robormiston.com?subject=MindWorks%20reflection%20feedback&body=What%20felt%20accurate%20or%20recognisable%3F%0D%0A%0D%0AWhat%20felt%20unclear%2C%20off-mark%2C%20or%20missing%3F%0D%0A%0D%0AAny%20other%20thoughts%20you%E2%80%99d%20be%20willing%20to%20share%3F"
                target="_blank"
                rel="noopener"
                class="underline hover:text-slate-800"
            >
              Share feedback
            </a>

          </div>

          <!-- Methodology -->
          <details
              class="mt-10 text-sm text-stone-600"
          >
            <summary class="cursor-pointer text-stone-700">
              Methodology & Sources
            </summary>

            <div class="mt-4 space-y-4">
              <p>
                This reflection is generated through structured language synthesis
                informed by established psychological frameworks.
              </p>

              <ul class="list-disc pl-5 space-y-1">
                <li>DSM-5-TR descriptive domains (non-diagnostic)</li>
                <li>NICE NG87 topic framing</li>
                <li>Executive function research</li>
                <li>Developmental and stress-based models</li>
              </ul>

              <p>
                This is not a diagnostic instrument or probability estimate.
              </p>
            </div>
          </details>

        </div> <!-- ← THIS was missing -->


      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, nextTick } from "vue"
import { adhdQuestions } from "../quiz/adhd/questions.js"

// ---------- State ----------
const answers = ref({})
const loading = ref(false)

const reportTexts = ref({
  overview: "",
  functioning: "",
  patterns: ""
})

const activeView = ref("overview")

// Typing state
const typedOverviewText = ref("")
const overviewHasTyped = ref(false)

// ---------- Refs ----------
const questionTextRefs = ref([])
const generateButtonRef = ref(null)

// ---------- View Config ----------
const views = [
  { key: "overview", label: "Overview" },
  { key: "functioning", label: "Daily functioning" },
  { key: "patterns", label: "Patterns & trade-offs" }
]

// ---------- Scale ----------
const scale = [
  { label: "Never", value: 0 },
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Very Often", value: 4 }
]

// ---------- Progress ----------
const totalCount = adhdQuestions.length
const answeredCount = computed(() => Object.keys(answers.value).length)
const reportContainerRef = ref(null)

// ---------- Scoring ----------
const scores = computed(() => {
  const totals = {
    inattention: 0,
    hyperactivity: 0,
    impulsivity: 0,
    executive_function: 0,
    emotional_regulation: 0
  }

  for (const [id, value] of Object.entries(answers.value)) {
    const q = adhdQuestions.find(q => q.id === id)
    if (q && totals[q.dimension] !== undefined) {
      totals[q.dimension] += Number(value)
    }
  }

  return totals
})

// ---------- Auto-scroll ----------
const handleAnswer = async (questionId, value, index) => {
  answers.value[questionId] = value
  await nextTick()

  const nextQuestion = questionTextRefs.value[index + 1]

  if (nextQuestion) {
    nextQuestion.scrollIntoView({ behavior: "smooth", block: "start" })
  } else if (generateButtonRef.value) {
    generateButtonRef.value.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

// ---------- Typing Helper ----------
const typeText = async (fullText, targetRef, speed = 12) => {
  targetRef.value = ""
  for (let i = 0; i < fullText.length; i++) {
    targetRef.value += fullText[i]
    await new Promise(resolve => setTimeout(resolve, speed))
  }
}

// ---------- API ----------
const generateOverview = async () => {
  loading.value = true
  try {
    const response = await fetch("/api/expand-report-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "overview",
        profile: scores.value
      })
    })

    const data = await response.json()
    const text = data.text || ""

    reportTexts.value.overview = text
    activeView.value = "overview"

    // ✅ ensure DOM is rendered before scrolling
    await nextTick()

    // ✅ scroll report container into view (safe guard)
    if (reportContainerRef?.value) {
      reportContainerRef.value.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }

    // ✅ type only once
    if (!overviewHasTyped.value) {
      overviewHasTyped.value = true
      await typeText(text, typedOverviewText)
    }

  } finally {
    loading.value = false
  }
}

const selectView = async (viewKey) => {
  activeView.value = viewKey

  if (reportTexts.value[viewKey]) return

  loading.value = true
  try {
    const response = await fetch("/api/expand-report-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: viewKey,
        profile: scores.value
      })
    })

    const data = await response.json()
    reportTexts.value[viewKey] = data.text || ""
  } finally {
    loading.value = false
  }
}

// ---------- Computed ----------
const activeText = computed(() => {
  if (activeView.value === "overview" && overviewHasTyped.value) {
    return typedOverviewText.value
  }
  return reportTexts.value[activeView.value]
})

// ---------- Formatting ----------
const formattedActiveText = computed(() => {
  if (!activeText.value) return ""

  const lines = activeText.value.replace(/\r/g, "").split("\n")
  let html = ""

  for (const line of lines) {
    if (/^\s*\*\*(.+?)\*\*\s*$/.test(line)) {
      const title = line.replace(/\*\*/g, "")
      html += `
        <h3 class="mt-10 mb-4 text-lg font-semibold tracking-tight text-stone-800">
          ${title}
        </h3>
      `
      continue
    }

    if (!line.trim()) continue

    html += `
      <p class="mb-4 leading-relaxed text-stone-700">
        ${line}
      </p>
    `
  }

  return html
})

</script>

