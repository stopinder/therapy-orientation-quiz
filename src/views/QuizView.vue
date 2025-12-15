<template>
  <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 px-6 py-20">
    <div class="max-w-3xl mx-auto space-y-20">

      <!-- Header -->
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
        <div
            v-for="question in questions"
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
                class="flex items-center justify-between
                     px-6 py-4 rounded-xl
                     bg-white/90
                     border border-stone-200
                     cursor-pointer
                     transition
                     hover:bg-white"
            >
              <span class="text-base text-stone-700">
                {{ option.label }}
              </span>

              <input
                  type="radio"
                  :name="question.id"
                  :value="option.value"
                  v-model="answers[question.id]"
                  :disabled="submitted"
                  class="h-5 w-5 accent-slate-700 flex-shrink-0"
              />
            </label>
          </div>
        </div>
      </section>

      <!-- Progress -->
      <p class="text-sm text-stone-500">
        Progress: {{ Object.keys(answers).length }} / {{ questions.length }} answered
      </p>


      <!-- Action -->
      <div class="pt-4">
        <button
            @click="generateReport"
            :disabled="submitted || Object.keys(answers).length !== questions.length"
            class="w-full sm:w-auto
                 px-8 py-4 rounded-full text-lg font-medium
                 bg-slate-700 text-white
                 hover:bg-slate-600
                 disabled:opacity-40 disabled:cursor-not-allowed
                 transition"
        >
          Generate Report
        </button>
      </div>

      <!-- Report -->
      <section
          v-if="submitted"
          ref="reportSection"
          class="max-w-2xl space-y-8 pt-16"
      >
        <div class="rounded-xl bg-stone-200/60 px-6 py-4">
          <h2 class="text-3xl font-medium tracking-tight text-stone-800">
            Your Therapy Orientation Report
          </h2>
        </div>

        <button
            @click="editAnswers"
            class="text-sm text-slate-600 underline hover:text-slate-800"
        >
          Edit answers
        </button>

        <p
            v-for="(paragraph, index) in report"
            :key="index"
            class="text-lg leading-relaxed text-stone-700"
        >
          {{ paragraph }}
        </p>
      </section>


    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue"
import { questions } from "../quiz/questions"
import { buildReport } from "../quiz/buildReport"

const submitted = ref(false)
const answers = ref({})
const frozenScores = ref(null)

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

  for (const [questionId, value] of Object.entries(answers.value)) {
    const question = questions.find(q => q.id === questionId)
    if (!question) continue
    totals[question.dimension] += Number(value)
  }

  return totals
})

const report = computed(() => {
  if (!frozenScores.value) return []
  return buildReport(frozenScores.value)
})

function generateReport() {
  frozenScores.value = { ...scores.value }
  submitted.value = true

  requestAnimationFrame(() => {
    reportSection.value?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  })
}


function editAnswers() {
  submitted.value = false
}
const reportSection = ref(null)

</script>
