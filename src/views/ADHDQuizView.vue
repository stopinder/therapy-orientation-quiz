<template>
  <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 px-6 py-20">
    <div class="max-w-3xl mx-auto space-y-20">
      <header class="relative max-w-2xl pl-8 space-y-5">
        <span class="absolute left-0 top-1 h-14 w-1 rounded-sm bg-slate-500"></span>
        <p class="text-xs uppercase tracking-widest text-slate-500">Self-Check</p>
        <h1 class="text-4xl font-medium tracking-tight text-stone-800">ADHD Reflection Quiz</h1>
        <p class="text-lg leading-relaxed text-stone-600">
          This reflection helps you notice everyday patterns in attention, focus, and energy.
          It’s not a diagnosis, but it can show whether a formal ADHD assessment might be helpful.
        </p>
      </header>

      <!-- Quiz -->
      <section class="space-y-16 rounded-2xl bg-white/80 shadow-soft px-6 py-8">
        <div v-for="question in adhdQuestions" :key="question.id" class="space-y-6">
          <p class="text-xl leading-relaxed text-stone-800">{{ question.text }}</p>


          <div class="space-y-4">
            <label
                v-for="option in scale"
                :key="option.value"
                class="flex items-center justify-between px-6 py-4 rounded-xl bg-white/90 border border-stone-200 cursor-pointer transition duration-200 ease-out hover:bg-white hover:shadow-sm active:scale-[0.99]"
            >
              <span class="text-base text-stone-700">{{ option.label }}</span>
              <input
                  type="radio"
                  :name="question.id"
                  :value="option.value"
                  v-model="answers[question.id]"
                  class="h-5 w-5 accent-slate-700 transition-transform duration-150"
              />
            </label>
          </div>
        </div>
        <button
            @click="generateReport"
            class="mt-8 px-6 py-3 rounded-xl bg-slate-700 text-white"
        >
          {{ loading ? "Generating…" : "Generate Report" }}
        </button>

        <div v-if="reportText" class="mt-10 text-stone-800 whitespace-pre-line">
          {{ reportText }}
        </div>

      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue"
import { adhdQuestions } from "../quiz/adhd/questions.js"
import { scoreADHDDimension } from "../quiz/adhd/scoring.js"


const answers = ref({})
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


const scale = [
  { label: "Never", value: 0 },
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Very Often", value: 4 }
]
const reportText = ref("")
const loading = ref(false)

const generateReport = async () => {
  loading.value = true

  const res = await fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      profile: scores.value,
      reportType: "brief"
    })
  })

  const data = await res.json()
  reportText.value = data.text || ""

  loading.value = false
}


</script>
