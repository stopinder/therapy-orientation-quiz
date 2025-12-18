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
      <div class="sticky top-16 z-40 bg-white border-b border-stone-200">
        <div class="max-w-3xl mx-auto px-2 py-2">
          <div class="w-full h-2 bg-stone-200">
            <div
                class="h-2 bg-slate-800"
                :style="{ width: (answeredCount / totalCount) * 100 + '%' }"
            ></div>
          </div>
        </div>
      </div>





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
          {{ loading ? "Generating…" : "Generate Reflection" }}
        </button>

        <div
            v-if="reportText"
            v-html="formattedReportText"
            class="mt-12 max-w-prose mx-auto prose prose-stone"
        ></div>

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
import { ref, computed } from "vue"
import { adhdQuestions } from "../quiz/adhd/questions.js"

const answers = ref({})
const reportText = ref("")
const loading = ref(false)

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
  const totalCount = adhdQuestions.length

  const answeredCount = computed(() =>
      Object.values(answers.value).filter(v => v !== undefined).length
  )


  const progressPercent = computed(() =>
      Math.round((answeredCount.value / totalCount) * 100)
  )

  for (const [id, value] of Object.entries(answers.value)) {
    const q = adhdQuestions.find(q => q.id === id)
    if (q && totals[q.dimension] !== undefined) {
      totals[q.dimension] += Number(value)
    }
  }

  return totals
})

const generateReport = async () => {
  const meaningful = Object.values(scores.value).filter(v => v >= 8).length >= 2

  if (!meaningful) {
    reportText.value = `
Based on your responses, no strongly elevated or consistent pattern emerged across the areas assessed.

This tool is designed to identify sustained, high-impact patterns rather than occasional or situational experiences.
  `.trim()

    return
  }

  loading.value = true
  try {
    const response = await fetch("/api/expand-report-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: scores.value
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

  const lines = reportText.value.split("\n").map(l => l.trim())

  let html = ""
  let inList = false

  for (const line of lines) {
    // Section headings (e.g. **Core Pattern Overview**)
    if (/^\*\*.+\*\*$/.test(line)) {
      if (inList) {
        html += "</ul>"
        inList = false
      }
      const title = line.replace(/\*\*/g, "")
      html += `<h3 class="mt-10 mb-4 text-xl font-semibold text-stone-800">${title}</h3>`
      continue
    }

    // Question list items
    if (line.startsWith("- ")) {
      if (!inList) {
        html += `<ul class="mt-4 space-y-3 list-disc pl-6">`
        inList = true
      }
      html += `<li class="text-stone-700">${line.replace("- ", "")}</li>`
      continue
    }

    // Empty line
    if (line === "") {
      if (inList) {
        html += "</ul>"
        inList = false
      }
      continue
    }

    // Normal paragraph
    if (inList) {
      html += "</ul>"
      inList = false
    }
    html += `<p class="mb-4 text-stone-700 leading-relaxed">${line}</p>`
  }

  if (inList) {
    html += "</ul>"
  }

  return html
})

</script>
