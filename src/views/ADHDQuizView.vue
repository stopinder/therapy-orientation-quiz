<template>
  <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 px-6 py-20">
    <div class="max-w-3xl mx-auto space-y-20">

      <!-- Header -->
      <header class="relative max-w-2xl pl-8 space-y-5">
        <span class="absolute left-0 top-1 h-14 w-1 rounded-sm bg-slate-500"></span>
        <p class="text-xs uppercase tracking-widest text-slate-500">System Mapping</p>

        <h1 class="text-4xl font-medium tracking-tight text-stone-800">
          A closer look at how your mind actually operates
        </h1>

        <p class="text-lg leading-relaxed text-stone-600">
          This reflection explores patterns in attention, motivation, and internal conflict.
          Not to label them, but to understand what’s driving them.
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

        <!-- Pre-result tension -->
        <p class="text-sm text-slate-600">
          This will generate a structured reflection based on your responses.
          Most people recognise patterns here they hadn’t been able to name before.
        </p>

        <!-- Generate Button -->
        <button
            ref="generateButtonRef"
            type="button"
            @click="generateOverview"
            class="mt-8 px-6 py-3 rounded-xl bg-slate-700 text-white scroll-mt-28"
        >
          {{ loading ? "Generating…" : "See your results" }}
        </button>

        <!-- Consent -->
        <p class="mt-3 text-xs text-slate-500 max-w-prose">
          By generating a reflection, you agree to the
          <router-link to="/terms" class="underline hover:text-slate-700">
            Terms of Use
          </router-link>
          and
          <router-link to="/privacy" class="underline hover:text-slate-700">
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

          <!-- Report Content -->
          <div v-html="formattedActiveText"></div>
          <div class="mt-10 text-center space-y-6">

            <p class="text-base text-slate-700 max-w-xl mx-auto">
              If this is accurate, the next step is not more insight — it is working with the pattern directly.
            </p>

            <button
                @click="goToProgramme"
                class="px-6 py-3 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition"
            >
              Start the guided process
            </button>

          </div>
          <!-- Conversion Bridge -->
          <div class="mt-10 p-6 bg-stone-50 border border-stone-200 rounded-xl">
            <p class="text-stone-800 font-medium mb-2">
              This is only part of the picture
            </p>

            <p class="text-sm text-stone-700 mb-4">
              What you’re seeing here is a surface-level map of your system.
              These patterns don’t shift through insight alone — they shift through working with them directly.
            </p>

            <button
                @click="goToDeepDive"
                class="px-5 py-2.5 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition"
            >
              Get your full breakdown
            </button>
          </div>

          <!-- Feedback -->
          <div class="mt-8 text-sm text-slate-600">
            <p class="mb-2 italic">
              If you noticed anything that felt particularly accurate, unclear, or off-mark,
              I’d genuinely welcome hearing about it.
            </p>

            <a
                href="mailto:emdrifs@robormiston.com?subject=MindWorks%20reflection%20feedback"
                target="_blank"
                rel="noopener"
                class="underline hover:text-slate-800"
            >
              Share feedback
            </a>
          </div>

        </div>

      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, nextTick } from "vue"
import { useRouter } from "vue-router"
import { adhdQuestions } from "../quiz/adhd/questions.js"

const router = useRouter()

const answers = ref({})
const loading = ref(false)

const reportTexts = ref({
  overview: "",
  functioning: "",
  patterns: ""
})

const activeView = ref("overview")
const typedOverviewText = ref("")
const overviewHasTyped = ref(false)

const questionTextRefs = ref([])
const generateButtonRef = ref(null)
const reportContainerRef = ref(null)

const views = [
  { key: "overview", label: "Overview" },
  { key: "functioning", label: "Daily functioning" },
  { key: "patterns", label: "Patterns & trade-offs" }
]

const scale = [
  { label: "Never", value: 0 },
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Very Often", value: 4 }
]

const totalCount = adhdQuestions.length
const answeredCount = computed(() => Object.keys(answers.value).length)

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

const typeText = async (fullText, targetRef, speed = 12) => {
  targetRef.value = ""
  for (let i = 0; i < fullText.length; i++) {
    targetRef.value += fullText[i]
    await new Promise(resolve => setTimeout(resolve, speed))
  }
}

const generateOverview = async () => {
  loading.value = true
  sessionStorage.setItem("quizProfile", JSON.stringify(scores.value))
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

    await nextTick()

    if (reportContainerRef?.value) {
      reportContainerRef.value.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }

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

const activeText = computed(() => {
  if (activeView.value === "overview" && overviewHasTyped.value) {
    return typedOverviewText.value
  }
  return reportTexts.value[activeView.value]
})

const formattedActiveText = computed(() => {
  if (!activeText.value) return ""

  return activeText.value
      .split("\n")
      .filter(line => line.trim())
      .map(line => `<p class="mb-4 text-stone-700">${line}</p>`)
      .join("")
})

const goToDeepDive = () => {
  router.push("/deep-dive")
}
const goToProgramme = () => {
  router.push("/programme")
}
</script>