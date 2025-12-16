<template>
  <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 px-6 py-20">
    <div class="max-w-3xl mx-auto space-y-20">

      <header class="space-y-6 max-w-2xl">
        <h1 class="text-4xl font-medium tracking-tight text-stone-800">
          Therapy Orientation Quiz
        </h1>
        <p class="text-lg leading-relaxed text-stone-700">
          This short reflection is designed to help you notice how you tend to
          approach emotional difficulty and therapeutic conversations.
        </p>
      </header>

      <!-- Quiz -->
      <section class="space-y-16">
        <div v-for="question in questions" :key="question.id" class="space-y-6">
          <p class="text-xl leading-relaxed text-stone-800">
            {{ question.text }}
          </p>

          <div class="space-y-4">
            <label
                v-for="option in scale"
                :key="option.value"
                class="flex items-center justify-between px-6 py-4 rounded-xl bg-white/90 border border-stone-200 cursor-pointer hover:bg-white"
            >
              <span class="text-base text-stone-700">{{ option.label }}</span>
              <input
                  type="radio"
                  :name="question.id"
                  :value="option.value"
                  v-model="answers[question.id]"
                  :disabled="submitted"
                  class="h-5 w-5 accent-slate-700"
              />
            </label>
          </div>
        </div>
      </section>

      <p class="text-sm text-stone-500">
        Progress: {{ Object.keys(answers).length }} / {{ questions.length }} answered
      </p>

      <button
          @click="generateReport"
          :disabled="submitted || Object.keys(answers).length !== questions.length"
          class="px-8 py-4 rounded-full bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-40"
      >
        Generate Report
      </button>

      <!-- Report -->
      <section v-if="submitted" ref="reportSection" class="space-y-8 pt-16">
        <h2 class="text-3xl font-medium text-stone-800">
          Your Therapy Orientation Report
        </h2>

        <p class="whitespace-pre-line text-stone-700">
          {{ finalReport }}
        </p>

        <button
            @click="expandWithAI"
            :disabled="isExpanding"
            class="text-sm text-slate-600 underline"
        >
          {{ isExpanding ? "Generating…" : "Expand with AI (optional)" }}
        </button>

        <section v-if="expandedReflection" class="mt-6 bg-white p-6 rounded-xl">
          <p class="whitespace-pre-line text-stone-700">
            {{ expandedReflection }}
          </p>
        </section>
      </section>

    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue"
import { questions } from "../quiz/questions"
import { buildReport } from "../quiz/buildReport"
import { scoreDimension } from "../quiz/scoring"

const submitted = ref(false)
const answers = ref({})
const frozenScores = ref(null)

const finalReport = ref("")
const expandedReflection = ref("")
const isExpanding = ref(false)

const scale = [
  { label: "Strongly disagree", value: -2 },
  { label: "Disagree", value: -1 },
  { label: "Neutral / depends", value: 0 },
  { label: "Agree", value: 1 },
  { label: "Strongly agree", value: 2 }
]

const scores = computed(() => {
  const totals = {
    internalExternal: 0,
    emotionalIntensity: 0,
    structurePreference: 0,
    relationalSensitivity: 0
  }

  for (const [id, value] of Object.entries(answers.value)) {
    const q = questions.find(q => q.id === id)
    if (q) totals[q.dimension] += Number(value)
  }

  return totals
})

function generateReport() {
  frozenScores.value = { ...scores.value }
  finalReport.value = buildReport(frozenScores.value)
  submitted.value = true
}

function buildProfile() {
  return {
    attention: scoreDimension(frozenScores.value.internalExternal),
    emotion: scoreDimension(frozenScores.value.emotionalIntensity),
    structure: scoreDimension(frozenScores.value.structurePreference),
    recommended_approaches: ["CBT", "ACT"]
  }
}

async function expandWithAI() {
  isExpanding.value = true

  try {
    const res = await fetch("/api/expand-report-v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: buildProfile() })
    })

    const data = await res.json()
    expandedReflection.value = data.text || ""
  } finally {
    isExpanding.value = false
  }
}
</script>
