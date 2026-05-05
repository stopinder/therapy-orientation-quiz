<template>
  <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 px-6 py-20">
    <div class="max-w-3xl mx-auto space-y-16">

      <header class="space-y-4">
        <p class="text-xs uppercase tracking-widest text-slate-500">System Mapping</p>
        <h1 class="text-4xl font-medium tracking-tight text-stone-800">
          A closer look at how your mind actually operates
        </h1>
      </header>

      <div class="sticky top-16 z-40 bg-stone-100 border-b border-stone-300">
        <div class="px-4 py-3 space-y-2">
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

      <section class="space-y-12 rounded-2xl bg-white/80 px-6 py-8">

        <div
            v-for="(question, index) in adhdQuestions"
            :key="question.id"
            class="space-y-6"
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

        <!-- Email Gate -->
        <div
            v-if="quizComplete && !activeText"
            ref="emailGateRef"
            class="mt-10 max-w-md mx-auto text-center space-y-4"
        >
          <p class="text-lg font-medium text-slate-900">
            Your reflection is ready.
          </p>

          <p class="text-sm text-slate-600">
            Enter your email to generate your personalised reflection.
            We’ll use this for occasional MindWorks updates. You can unsubscribe at any time.
          </p>

          <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="w-full px-4 py-3 border border-stone-300 rounded-md text-slate-900"
          />

          <p v-if="emailError" class="text-sm text-red-600">
            Please enter a valid email.
          </p>

          <button
              @click="submitEmailAndGenerate"
              :disabled="loading"
              class="w-full px-6 py-3 bg-slate-900 text-white rounded-md disabled:opacity-40"
          >
            {{ loading ? "Generating…" : "Generate my reflection" }}
          </button>
        </div>

        <!-- Report -->
        <div v-if="activeText" ref="reportContainerRef" class="mt-12 max-w-prose mx-auto">

          <div class="flex gap-2 mb-6 justify-center">
            <button
                v-for="view in views"
                :key="view.key"
                @click="selectView(view.key)"
                class="px-4 py-1.5 rounded-full text-sm border transition"
                :class="activeView === view.key
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-stone-300 hover:bg-stone-50'"
            >
              {{ view.label }}
            </button>
          </div>

          <div v-html="formattedActiveText"></div>

          <div class="mt-6 flex gap-4 justify-center">
            <button @click="copyReflection" class="px-4 py-2 bg-stone-200 rounded-md">
              Copy
            </button>

            <button @click="downloadPDF" class="px-4 py-2 bg-stone-200 rounded-md">
              Download
            </button>
          </div>

          <div v-if="showNextStep" class="mt-10 text-center space-y-6 max-w-xl mx-auto">
            <p class="text-slate-700">{{ adaptiveMessage.line1 }}</p>
            <p class="text-slate-700">{{ adaptiveMessage.line2 }}</p>
            <p class="text-slate-700">{{ adaptiveMessage.line3 }}</p>

            <button
                @click="goToProgramme"
                class="mt-4 px-6 py-3 bg-slate-900 text-white rounded-md"
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
import { supabase } from "../lib/supabase.js"

const router = useRouter()

const answers = ref({})
const loading = ref(false)
const showNextStep = ref(false)

const email = ref("")
const emailError = ref(false)

const reportTexts = ref({
  overview: "",
  functioning: "",
  patterns: ""
})

const views = [
  { key: "overview", label: "Overview" },
  { key: "functioning", label: "Daily functioning" },
  { key: "patterns", label: "Patterns & trade-offs" }
]

const activeView = ref("overview")

const questionTextRefs = ref([])
const emailGateRef = ref(null)
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

const quizComplete = computed(() =>
    answeredCount.value === totalCount
)

const progressPercent = computed(() =>
    Math.round((answeredCount.value / totalCount) * 100)
)

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
    const question = adhdQuestions.find(q => q.id === id)

    if (question && totals[question.dimension] !== undefined) {
      totals[question.dimension] += Number(value)
    }
  }

  return totals
})

const isValidEmail = computed(() =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
)

const handleAnswer = async (questionId, value, index) => {
  answers.value[questionId] = value

  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 120))

  const nextQuestion = questionTextRefs.value[index + 1]

  if (nextQuestion) {
    nextQuestion.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  } else {
    emailGateRef.value?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }
}

const saveEmail = async () => {
  sessionStorage.setItem("userEmail", email.value)

  try {
    await supabase.from("emails").insert([
      {
        email: email.value,
        source: "quiz_completion"
      }
    ])
  } catch (err) {
    console.error("Email save failed:", err)
  }
}

const fetchReport = async (mode) => {
  const response = await fetch("/api/expand-report-v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      profile: scores.value,
      mode
    })
  })

  const raw = await response.text()

  if (!response.ok) {
    console.error(`API error (${mode}):`, raw)
    throw new Error(`API failed with status ${response.status}`)
  }

  try {
    return JSON.parse(raw)
  } catch (err) {
    console.error(`Invalid JSON from API (${mode}):`, raw)
    throw err
  }
}

const submitEmailAndGenerate = async () => {
  if (!isValidEmail.value || loading.value) {
    emailError.value = true
    return
  }

  emailError.value = false
  loading.value = true
  showNextStep.value = false

  try {
    await saveEmail()

    const data = await fetchReport("overview")

    reportTexts.value.overview = data.text || ""
    activeView.value = "overview"

    await nextTick()

    reportContainerRef.value?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  } catch (err) {
    console.error("Generate error:", err)
    alert("Something went wrong. Check console.")
  } finally {
    loading.value = false
  }
}

const selectView = async (viewKey) => {
  activeView.value = viewKey

  if (reportTexts.value[viewKey] || loading.value) return

  loading.value = true

  try {
    const data = await fetchReport(viewKey)
    reportTexts.value[viewKey] = data.text || ""

    await nextTick()

    reportContainerRef.value?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  } catch (err) {
    console.error("View load error:", err)
    alert("Could not load this section. Check console.")
  } finally {
    loading.value = false
  }
}

const activeText = computed(() =>
    reportTexts.value[activeView.value] || ""
)

const formattedActiveText = computed(() => {
  if (!activeText.value) return ""

  return activeText.value
      .split("\n")
      .filter(line => line.trim())
      .map(line => `<p class="mb-4">${line}</p>`)
      .join("")
})

const copyReflection = async () => {
  if (!activeText.value) return

  try {
    await navigator.clipboard.writeText(activeText.value)

    setTimeout(() => {
      showNextStep.value = true
    }, 400)
  } catch {
    alert("Copy failed — try selecting the text manually.")
  }
}

const dominantPattern = computed(() => {
  const sorted = [...Object.entries(scores.value)].sort((a, b) => b[1] - a[1])
  return sorted[0]?.[0] || "general"
})

const adaptiveMessage = computed(() => {
  switch (dominantPattern.value) {
    case "inattention":
      return {
        line1: "Your attention drops before your intention completes.",
        line2: "You don’t lose direction — you lose continuity.",
        line3: "That break repeats unless you work directly with it."
      }

    case "executive_function":
      return {
        line1: "You know what needs to be done.",
        line2: "The problem is getting into and staying in it.",
        line3: "That gap doesn’t close through effort alone."
      }

    case "impulsivity":
      return {
        line1: "Your system moves before it stabilises.",
        line2: "Action happens faster than reflection.",
        line3: "That speed creates patterns you don’t hold."
      }

    case "emotional_regulation":
      return {
        line1: "Your state shifts quickly under pressure.",
        line2: "Once activated, it pulls you off track.",
        line3: "That loop repeats unless you intervene directly."
      }

    case "hyperactivity":
      return {
        line1: "Your system struggles to settle.",
        line2: "Stillness feels unnatural.",
        line3: "That constant activation disrupts continuity."
      }

    default:
      return {
        line1: "You can recognise the pattern clearly.",
        line2: "The difficulty is what happens when it breaks.",
        line3: "That moment repeats unless you work with it."
      }
  }
})

const downloadPDF = () => {
  if (!activeText.value) return

  const blob = new Blob([activeText.value], { type: "text/plain" })
  const link = document.createElement("a")

  link.href = URL.createObjectURL(blob)
  link.download = "mindworks-reflection.txt"
  link.click()

  URL.revokeObjectURL(link.href)
}

const goToProgramme = () => {
  router.push("/programme")
}
</script>