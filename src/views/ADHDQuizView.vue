<template>
  <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 px-6 py-20">
    <div class="max-w-3xl mx-auto space-y-16">

      <!-- Header -->
      <header class="space-y-4">
        <p class="text-xs uppercase tracking-widest text-slate-500">System Mapping</p>

        <h1 class="text-4xl font-medium tracking-tight text-stone-800">
          A closer look at how your mind actually operates
        </h1>
      </header>

      <!-- Progress -->
      <div class="sticky top-16 z-40 bg-stone-100 border-b border-stone-300">
        <div class="max-w-3xl mx-auto px-4 py-3 space-y-2">

          <div class="flex justify-between text-sm text-slate-600">
            <span>Progress</span>
            <span>{{ progressPercent }}%</span>
          </div>

          <div class="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
                class="h-full bg-slate-800 transition-all duration-300"
                :style="{ width: progressPercent + '%' }"
            ></div>
          </div>

          <p class="text-xs text-slate-500">
            Keep going — this gets clearer quickly.
          </p>
        </div>
      </div>

      <!-- Quiz -->
      <section class="space-y-12 rounded-2xl bg-white/80 px-6 py-8">

        <div
            v-for="(question, index) in adhdQuestions"
            :key="question.id"
            class="space-y-6 transition-all duration-300"
        >
          <p
              class="text-xl text-stone-800 scroll-mt-36"
              :ref="el => questionTextRefs[index] = el"
          >
            {{ question.text }}
          </p>

          <div class="space-y-3">
            <label
                v-for="option in scale"
                :key="option.value"
                class="flex justify-between px-6 py-4 rounded-xl border cursor-pointer transition"
                :class="answers[question.id] === option.value
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'"
            >
              <span>{{ option.label }}</span>

              <input
                  type="radio"
                  :name="question.id"
                  :value="option.value"
                  :checked="answers[question.id] === option.value"
                  @change="handleAnswer(question.id, option.value, index)"
                  class="h-5 w-5 accent-white"
              />
            </label>
          </div>
        </div>

        <!-- Generate -->
        <div class="text-center pt-6">
          <button
              ref="generateButtonRef"
              @click="generateOverview"
              class="px-6 py-3 bg-slate-900 text-white rounded-md"
          >
            {{ loading ? "Generating…" : "See your results" }}
          </button>
        </div>

        <!-- Report -->
        <div v-if="activeText" ref="reportContainerRef" class="mt-12 max-w-prose mx-auto">

          <div v-html="formattedActiveText"></div>

          <!-- Actions -->
          <div class="mt-6 flex gap-4 justify-center">
            <button @click="copyReflection" class="px-4 py-2 bg-stone-200 rounded-md">
              Copy
            </button>

            <button @click="downloadPDF" class="px-4 py-2 bg-stone-200 rounded-md">
              Download
            </button>
          </div>

          <!-- Conversion -->
          <div v-if="showNextStep" class="mt-8 text-center space-y-4">
            <p class="text-slate-700 max-w-md mx-auto">
              If this feels accurate, the next step is not more insight — it’s working with the pattern directly.
            </p>

            <button
                @click="goToProgramme"
                class="px-6 py-3 bg-slate-900 text-white rounded-md"
            >
              Start the guided process
            </button>
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
const showNextStep = ref(false)

const reportTexts = ref({ overview: "" })

const questionTextRefs = ref([])
const generateButtonRef = ref(null)
const reportContainerRef = ref(null)

const scale = [
  { label: "Never", value: 0 },
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
  { label: "Very Often", value: 4 }
]

const totalCount = adhdQuestions.length

const answeredCount = computed(() =>
    Object.keys(answers.value).length
)

const progressPercent = computed(() =>
    Math.round((answeredCount.value / totalCount) * 100)
)

//
// 🔥 SCORING LAYER (NEW)
//
const scores = computed(() => {
  const totals = {
    inattention: 0,
    hyperactivity: 0,
    impulsivity: 0,
    executive_function: 0,
    emotional_regulation: 0,
    functional_impact: 0
  }

  for (const [id, value] of Object.entries(answers.value)) {
    const q = adhdQuestions.find(q => q.id === id)
    if (q && totals[q.dimension] !== undefined) {
      totals[q.dimension] += Number(value)
    }
  }

  return totals
})

//
// ANSWER FLOW
//
const handleAnswer = async (questionId, value, index) => {
  answers.value[questionId] = value

  await nextTick()
  await new Promise(r => setTimeout(r, 120))

  const next = questionTextRefs.value[index + 1]

  if (next) {
    next.scrollIntoView({ behavior: "smooth", block: "start" })
  } else {
    generateButtonRef.value?.scrollIntoView({ behavior: "smooth" })
  }
}

//
// GENERATE REPORT (FIXED)
//
const generateOverview = async () => {
  loading.value = true

  const response = await fetch("/api/expand-report-v2", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      profile: scores.value,   // ✅ FIXED HERE
      mode: "overview"
    })
  })

  const data = await response.json()
  reportTexts.value.overview = data.text || ""

  await nextTick()
  reportContainerRef.value?.scrollIntoView({ behavior: "smooth" })

  loading.value = false
}

//
// OUTPUT
//
const activeText = computed(() => reportTexts.value.overview)

const formattedActiveText = computed(() => {
  return activeText.value
      ?.split("\n")
      .filter(l => l.trim())
      .map(l => `<p class="mb-4">${l}</p>`)
      .join("")
})

//
// ACTIONS
//
const copyReflection = async () => {
  try {
    await navigator.clipboard.writeText(activeText.value)
    showNextStep.value = true
  } catch {
    alert("Copy failed")
  }
}

const downloadPDF = () => {
  const blob = new Blob([activeText.value], { type: "text/plain" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "reflection.txt"
  link.click()
}

const goToProgramme = () => {
  router.push("/programme")
}
</script>