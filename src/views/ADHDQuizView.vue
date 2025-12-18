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
          It’s not a diagnosis, but it can show whether a formal ADHD assessment might be helpful.
        </p>
      </header>

      <!-- Quiz -->
      <section class="space-y-16 rounded-2xl bg-white/80 shadow-soft px-6 py-8">
        <div
            v-for="question in adhdQuestions"
            :key="question.id"
            class="space-y-6"
        >
          <p class="text-xl leading-relaxed text-stone-800">
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
                  v-model="answers[question.id]"
                  class="h-5 w-5 accent-slate-700"
              />
            </label>
          </div>
        </div>

        <button
            type="button"
            @click="generateReport"
            class="mt-8 px-6 py-3 rounded-xl bg-slate-700 text-white"
        >
          {{ loading ? "Generating…" : "Generate Report" }}
        </button>

        <div
            v-if="reportText"
            v-html="formattedReportText"
            :class="[
            reportType === 'expanded'
              ? 'mb-16 max-w-prose mx-auto prose prose-stone'
              : 'mb-8 max-w-prose mx-auto prose prose-stone'
          ]"
        ></div>

        <details
            v-if="reportType === 'expanded'"
            class="mt-6 text-sm text-stone-600 max-w-prose mx-auto"
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

        <button
            v-if="reportType === 'brief'"
            @click="loadExpandedReport"
            class="mt-6 px-6 py-3 rounded-xl bg-slate-700 text-white"
        >
          View expanded reflection
        </button>
      </section>

    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue"
import { adhdQuestions } from "../quiz/adhd/questions.js"

const answers = ref({})
const reportText = ref("")
const loading = ref(false)
const reportType = ref("brief")

const scale = [
  { label: "Never", value: 0 },
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Very Often", value: 4 }
]

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

const generateReport = async () => {
  loading.value = true
  try {
    const response = await fetch("/api/expand-report-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: scores.value,
        reportType: "brief"
      })
    })
    const data = await response.json()
    reportText.value = data.text || ""
  } finally {
    loading.value = false
  }
}

const loadExpandedReport = async () => {
  loading.value = true
  reportType.value = "expanded"
  try {
    const response = await fetch("/api/expand-report-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: scores.value,
        reportType: "expanded"
      })
    })
    const data = await response.json()
    reportText.value = data.text || ""
  } finally {
    loading.value = false
  }
}

const formattedReportText = computed(() => {
  if (!reportText.value) return ""
  return `<p>${reportText.value
      .split("\n\n")
      .map(p => p.trim())
      .filter(Boolean)
      .join("</p><p>")}</p>`
})
</script>
