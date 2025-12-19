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
            @click="generateReport"
            class="mt-8 px-6 py-3 rounded-xl bg-slate-700 text-white scroll-mt-28"
        >
          {{ loading ? "Generating…" : "Generate Reflection" }}
        </button>

        <!-- Report -->
        <div
            v-if="reportText"
            v-html="formattedReportText"
            class="mt-12 max-w-prose mx-auto prose prose-stone"
        ></div>

        <!-- Methodology -->
        <details
            v-if="reportText"
            class="mt-10 text-sm text-stone-600 max-w-prose mx-auto"
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

      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, nextTick } from "vue"
import { adhdQuestions } from "../quiz/adhd/questions.js"

// State
const answers = ref({})
const reportText = ref("")
const loading = ref(false)

// Refs
const questionTextRefs = ref([])
const generateButtonRef = ref(null)

// Scale
const scale = [
  { label: "Never", value: 0 },
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Very Often", value: 4 }
]

// Progress
const totalCount = adhdQuestions.length
const answeredCount = computed(() => Object.keys(answers.value).length)

// Scoring
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

// Auto-scroll handler
const handleAnswer = async (questionId, value, index) => {
  answers.value[questionId] = value
  await nextTick()

  const nextQuestion = questionTextRefs.value[index + 1]

  if (nextQuestion) {
    nextQuestion.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  } else if (generateButtonRef.value) {
    generateButtonRef.value.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }
}

// Generate report
const generateReport = async () => {
  loading.value = true

  try {
    const response = await fetch("/api/expand-report-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: scores.value })
    })

    const data = await response.json()
    reportText.value = data.text || ""
  } finally {
    loading.value = false
  }
}

// Report formatter (restores paragraphs + headings)
const formattedReportText = computed(() => {
  if (!reportText.value) return ""

  const lines = reportText.value.split("\n")
  let html = ""

  for (const line of lines) {
    if (line.startsWith("## ")) {
      html += `<h3>${line.replace("## ", "")}</h3>`
    } else if (line.trim() === "") {
      html += ""
    } else {
      html += `<p>${line}</p>`
    }
  }

  return html
})
</script>
