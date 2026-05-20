<template>
  <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 px-6 py-20">
    <div class="max-w-3xl mx-auto space-y-16">

      <header class="space-y-4">
        <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">
          System Mapping
        </p>

        <h1 class="text-3xl md:text-[2.6rem] font-medium tracking-[-0.02em] leading-[1.12] text-stone-900">
          A closer look at how your mind actually operates
        </h1>
      </header>

      <div
          v-if="!activeText"
          class="sticky top-16 z-40 border-b border-stone-300 bg-stone-100/95 backdrop-blur"
      >
        <div class="space-y-2 px-4 py-3">

          <div class="flex justify-between text-sm text-slate-600">
            <span>Progress</span>
            <span>{{ progressPercent }}%</span>
          </div>

          <div class="h-2 w-full overflow-hidden rounded-full bg-stone-200">
            <div
                class="h-full bg-slate-800 transition-all duration-300"
                :style="{ width: progressPercent + '%' }"
            />
          </div>

          <p class="text-xs text-slate-500">
            Recognition becomes clearer as the pattern accumulates.
          </p>

        </div>
      </div>

      <section class="space-y-12 rounded-2xl bg-white/70 px-6 py-8">

        <div
            v-for="(question, index) in adhdQuestions"
            v-show="!activeText"
            :key="question.id"
            class="space-y-6"
        >

          <p
              class="scroll-mt-36 text-[1.3rem] leading-[1.7] text-stone-800"
              :ref="el => questionTextRefs[index] = el"
          >
            {{ question.text }}
          </p>

          <div class="space-y-3">

            <label
                v-for="option in scale"
                :key="option.value"
                class="flex cursor-pointer justify-between rounded-xl border px-6 py-4 transition"
                :class="answers[question.id] === option.value
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'"
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

        <div
            v-if="quizComplete && loading && !activeText"
            ref="loadingContainerRef"
            class="mt-16 scroll-mt-36 space-y-5 text-center"
        >

          <div class="animate-pulse space-y-4">

            <p class="text-lg font-medium text-slate-900">
              {{ loadingStage }}
            </p>

            <p class="text-sm text-slate-500">
              This usually takes a few seconds.
            </p>

          </div>

        </div>

        <div
            v-if="loading && quizComplete"
            class="flex justify-center pt-6"
        >
          <div class="animate-bounce text-sm tracking-[0.18em] uppercase text-slate-500">
            Reflection appearing below
          </div>
        </div>

        <div
            v-if="activeText || isTypingOverview || displayedOverview"
            ref="reportContainerRef"
            class="mx-auto mt-12 max-w-prose scroll-mt-36"
        >

          <div
              v-if="reportTexts.tldr"
              class="mb-10 rounded-2xl border border-slate-200 bg-slate-100 p-8"
          >

            <h2 class="mb-4 text-[1.35rem] font-medium text-slate-900">
              TL;DR
            </h2>

            <div
                class="text-[1rem] leading-[1.85] text-slate-700"
                v-html="formattedTldrText"
            ></div>

          </div>

          <div
              v-if="!emailSubmitted"
              class="mb-10 rounded-2xl border border-stone-200 bg-white/80 p-8"
          >

            <div class="space-y-6">

              <div class="space-y-3">

                <h3 class="text-[1.7rem] font-medium tracking-[-0.02em] leading-tight text-stone-900">
                  Continue with the full reflection
                </h3>

                <div class="max-w-xl space-y-3 text-[1rem] leading-[1.8] text-slate-600">

                  <p>
                    Receive the complete reflection and downloadable report.
                  </p>

                  <p>
                    The aim is not diagnosis or self-improvement performance.
                    It is clearer recognition of how continuity breaks down in everyday life.
                  </p>

                </div>

              </div>

              <input
                  v-model="email"
                  type="email"
                  placeholder="Email address"
                  class="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none transition focus:border-slate-500"
              />

              <p
                  v-if="emailError"
                  class="text-sm text-red-600"
              >
                {{ emailError }}
              </p>

              <button
                  @click="unlockReport"
                  class="w-full rounded-xl border border-slate-900 bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Receive full reflection
              </button>

            </div>

          </div>

          <div v-if="emailSubmitted">

            <div class="sticky top-16 z-30 mb-8 border-y border-stone-200 bg-stone-50/95 py-4 backdrop-blur">

              <div class="flex flex-wrap justify-center gap-2">

                <button
                    v-for="view in views"
                    :key="view.key"
                    @click="selectView(view.key)"
                    class="rounded-full border px-4 py-1.5 text-sm transition"
                    :class="activeView === view.key
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-stone-300 bg-white text-slate-700 hover:bg-stone-50'"
                >
                  {{ view.label }}
                </button>

              </div>

            </div>

            <div
                ref="reportContentTopRef"
                class="h-px w-full"
            ></div>

            <transition name="fade" mode="out-in">

              <div
                  :key="activeView"
                  @click="completeTyping"
              >

                <div class="mb-10">

                  <h2 class="mb-3 text-[2rem] font-medium tracking-[-0.02em] leading-tight text-stone-900">
                    {{ activeViewLabel }}
                  </h2>

                  <p class="max-w-2xl text-[1rem] leading-[1.8] text-slate-600">
                    {{ activeViewIntro }}
                  </p>

                </div>

                <div v-html="formattedActiveText"></div>

              </div>

            </transition>

            <div class="mt-12 flex justify-center">

              <button
                  @click="downloadReflection"
                  class="rounded-xl border border-slate-900 bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Download reflection
              </button>

            </div>

            <div
                v-if="downloadComplete"
                class="mt-4 text-center text-sm text-slate-500"
            >
              Reflection downloaded.
            </div>

            <div
                v-if="showNextStep"
                class="mx-auto mt-20 max-w-2xl space-y-6 text-center"
            >

              <div class="space-y-5 text-[1rem] leading-[1.9] text-slate-700">

                <p>
                  {{ adaptiveMessage.line1 }}
                </p>

                <p>
                  {{ adaptiveMessage.line2 }}
                </p>

                <p>
                  {{ adaptiveMessage.line3 }}
                </p>

              </div>

              <div class="space-y-4 pt-2">

                <p class="mx-auto max-w-xl text-[1rem] leading-[1.8] text-slate-600">
                  The six-week guided programme continues this work through structured
                  observation, embodied attention practices, and continuity exercises.
                </p>

                <button
                    @click="goToProgramme"
                    class="rounded-xl border border-slate-900 bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Continue to the programme
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  </main>
</template>
<script setup>
import { computed, nextTick, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { adhdQuestions } from "../quiz/adhd/questions.js"

const router = useRouter()

onMounted(() => {
  window.scrollTo({
    top: 0,
    behavior: "instant"
  })
})

const answers = ref({})
const loading = ref(false)
const loadingStage = ref("")

const downloadComplete = ref(false)
const showNextStep = ref(false)

const email = ref("")
const emailSubmitted = ref(false)
const emailError = ref("")

const reportReady = ref(false)

const reportTexts = ref({
  tldr: "",
  overview: "",
  functioning: "",
  patterns: "",
  closing: ""
})

const views = [
  {
    key: "overview",
    label: "Overview",
    intro: "How the pattern tends to operate moment to moment."
  },
  {
    key: "functioning",
    label: "Daily functioning",
    intro: "How the pattern accumulates across ordinary responsibilities."
  },
  {
    key: "patterns",
    label: "Patterns & trade-offs",
    intro: "The contradictions that quietly keep the cycle going."
  }
]

const activeView = ref("overview")

const questionTextRefs = ref([])
const loadingContainerRef = ref(null)
const reportContainerRef = ref(null)
const reportContentTopRef = ref(null)

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

const handleAnswer = async (questionId, value, index) => {

  answers.value[questionId] = value

  await nextTick()

  const nextQuestion = questionTextRefs.value[index + 1]

  if (nextQuestion) {

    nextQuestion.scrollIntoView({
      behavior: "smooth",
      block: "center"
    })

    return

  }

  if (quizComplete.value && !loading.value && !reportReady.value) {

    loading.value = true

    await nextTick()

    setTimeout(() => {

      loadingContainerRef.value?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      })

    }, 150)

    await generateInitialReport()

  }

}

const fetchReport = async () => {

  const response = await fetch("/api/expand-report-v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      profile: scores.value
    })
  })

  const raw = await response.text()

  if (!response.ok) {
    console.error("API ERROR:", raw)
    throw new Error(`API failed with status ${response.status}`)
  }

  try {
    return JSON.parse(raw)
  } catch (err) {
    console.error("INVALID JSON:", raw)
    throw err
  }

}

const generateInitialReport = async () => {

  loading.value = true
  showNextStep.value = false
  downloadComplete.value = false

  loadingStage.value = "Analysing behavioural patterns..."

  try {

    await new Promise(resolve => setTimeout(resolve, 700))

    loadingStage.value = "Mapping interruption loops..."

    await new Promise(resolve => setTimeout(resolve, 700))

    loadingStage.value = "Generating reflection..."

    const data = await fetchReport()

    reportTexts.value = {
      tldr: data.tldr || "",
      overview: data.overview || "",
      functioning: data.functioning || "",
      patterns: data.patterns || "",
      closing: data.closing || ""
    }

    activeView.value = "overview"

    reportReady.value = true

    loading.value = false

    await nextTick()

    setTimeout(() => {

      reportContainerRef.value?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })

    }, 250)

    saveReflectionLocally()

  } catch (err) {

    console.error("Generate error:", err)

    loading.value = false

    alert("Something went wrong. Check console.")

  }

}

const saveReflectionLocally = () => {

  const reflectionData = {
    createdAt: new Date().toISOString(),
    scores: scores.value,
    reports: reportTexts.value
  }

  localStorage.setItem(
      "mindworks_latest_reflection",
      JSON.stringify(reflectionData)
  )

}

const unlockReport = async () => {

  emailError.value = ""

  if (!email.value || !email.value.includes("@")) {

    emailError.value = "Please enter a valid email address."
    return

  }

  try {

    const response = await fetch("/api/capture-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed")
    }

    emailSubmitted.value = true

    await nextTick()

    window.scrollTo({
      top: reportContainerRef.value.offsetTop - 100,
      behavior: "smooth"
    })

  } catch (err) {

    console.error("Unlock error:", err)

    emailError.value =
        "Something went wrong. Please try again."

  }

}

const selectView = async (viewKey) => {

  activeView.value = viewKey

  await nextTick()

  if (!reportContentTopRef.value) return

  const targetY =
      reportContentTopRef.value.getBoundingClientRect().top +
      window.scrollY -
      120

  window.scrollTo({
    top: targetY,
    behavior: "smooth"
  })

}

const activeText = computed(() =>
    reportTexts.value[activeView.value] || ""
)

const activeViewLabel = computed(() =>
    views.find(v => v.key === activeView.value)?.label || ""
)

const activeViewIntro = computed(() =>
    views.find(v => v.key === activeView.value)?.intro || ""
)

const escapeHtml = (text) => {

  return String(text || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;")

}

const allowBasicFormatting = (text) => {

  if (!text) return ""

  return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replaceAll("&lt;strong&gt;", "<strong>")
      .replaceAll("&lt;/strong&gt;", "</strong>")

}

const normaliseBulletLine = (line) => {

  return line
      .replace(/^[-*•]\s*/, "")
      .trim()

}

const formattedTldrText = computed(() => {

  if (!reportTexts.value.tldr) return ""

  const lines = reportTexts.value.tldr
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)

  const looksLikeBullets = lines.some(line =>
      /^[-*•]\s+/.test(line)
  )

  if (looksLikeBullets) {

    const items = lines
        .map(line => {

          const safeLine = allowBasicFormatting(
              escapeHtml(normaliseBulletLine(line))
          )

          return `<li>${safeLine}</li>`

        })
        .join("")

    return `<ul class="space-y-3 list-disc pl-5">${items}</ul>`

  }

  const safeText = allowBasicFormatting(
      escapeHtml(reportTexts.value.tldr)
  )

  return `<p>${safeText}</p>`

})

const formattedActiveText = computed(() => {

  if (!activeText.value) return ""

  return activeText.value
      .split("\n\n")
      .map(p => {

        const safeParagraph = allowBasicFormatting(
            escapeHtml(p)
        )

        return `
        <p class="mb-6 text-[1rem] leading-[1.9] text-stone-800">
          ${safeParagraph}
        </p>
      `

      })
      .join("")

})
const formatParagraphsForDownload = (text) => {

  if (!text) return ""

  return text
      .split("\n\n")
      .map(p => {

        const safeParagraph = allowBasicFormatting(
            escapeHtml(p)
        )

        return `<p>${safeParagraph}</p>`

      })
      .join("")

}

const formatTldrForDownload = (text) => {

  if (!text) return ""

  const lines = text
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)

  const looksLikeBullets = lines.some(line =>
      /^[-*•]\s+/.test(line)
  )

  if (looksLikeBullets) {

    const items = lines
        .map(line => {

          const safeLine = allowBasicFormatting(
              escapeHtml(normaliseBulletLine(line))
          )

          return `<li>${safeLine}</li>`

        })
        .join("")

    return `<ul>${items}</ul>`

  }

  const safeText = allowBasicFormatting(
      escapeHtml(text)
  )

  return `<p>${safeText}</p>`

}

const downloadReflection = () => {

  try {

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>MindWorks Reflection</title>

<style>

body {
  font-family: Arial, sans-serif;
  background: #fafaf9;
  color: #1c1917;
  line-height: 1.8;
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 32px;
}

h1 {
  font-size: 38px;
  margin-bottom: 8px;
}

h2 {
  margin-top: 48px;
  margin-bottom: 10px;
  font-size: 28px;
}

.intro {
  color: #57534e;
  margin-bottom: 20px;
}

.section {
  margin-bottom: 56px;
}

.tldr {
  background: #f1f5f9;
  border-radius: 18px;
  padding: 28px;
  margin-top: 36px;
}

p {
  margin-bottom: 18px;
}

ul {
  margin-top: 18px;
  padding-left: 24px;
}

li {
  margin-bottom: 12px;
}

strong {
  font-weight: 700;
  color: #0f172a;
}

.footer {
  margin-top: 80px;
  padding-top: 24px;
  border-top: 1px solid #d6d3d1;
  color: #57534e;
}

</style>
</head>

<body>

<h1>MindWorks Reflection</h1>

<p>
Behavioural continuity, interruption patterns, and attention structure.
</p>

<div class="tldr">

<h2>TL;DR</h2>

${formatTldrForDownload(reportTexts.value.tldr)}

</div>

<div class="section">

<h2>Overview</h2>

<p class="intro">
How the pattern tends to operate moment to moment.
</p>

${formatParagraphsForDownload(reportTexts.value.overview)}

</div>

<div class="section">

<h2>Daily functioning</h2>

<p class="intro">
How the pattern accumulates across ordinary responsibilities.
</p>

${formatParagraphsForDownload(reportTexts.value.functioning)}

</div>

<div class="section">

<h2>Patterns & trade-offs</h2>

<p class="intro">
The contradictions that quietly keep the cycle going.
</p>

${formatParagraphsForDownload(reportTexts.value.patterns)}

</div>

<div class="footer">

<p>
${allowBasicFormatting(
        escapeHtml(reportTexts.value.closing)
    )}
</p>

</div>

</body>
</html>`

    const blob = new Blob(
        [html],
        { type: "text/html;charset=utf-8" }
    )

    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")

    link.href = url
    link.download = "mindworks-reflection.html"

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(url)

    downloadComplete.value = true
    showNextStep.value = false

    setTimeout(() => {

      downloadComplete.value = false
      showNextStep.value = true

    }, 1800)

  } catch (err) {

    console.error("Download failed:", err)
    alert("Download failed.")

  }

}
const dominantPattern = computed(() => {

  const sorted = [...Object.entries(scores.value)]
      .sort((a, b) => b[1] - a[1])

  return sorted[0]?.[0] || "general"

})

const adaptiveMessage = computed(() => {

  switch (dominantPattern.value) {

    case "inattention":
      return {
        line1: "Your attention drops before your intention completes.",
        line2: "You do not lose direction — you lose continuity.",
        line3: "That break repeats unless it is worked with directly."
      }

    case "executive_function":
      return {
        line1: "You usually know what needs to happen.",
        line2: "The difficulty is entering and remaining inside it.",
        line3: "That gap rarely closes through effort alone."
      }

    case "impulsivity":
      return {
        line1: "Your system often moves before it stabilises.",
        line2: "Action arrives faster than reflection.",
        line3: "That speed creates patterns you do not fully hold."
      }

    case "emotional_regulation":
      return {
        line1: "Your state shifts quickly under pressure.",
        line2: "Once activated, it reorganises attention.",
        line3: "That loop repeats unless recognised earlier."
      }

    case "hyperactivity":
      return {
        line1: "Your system struggles to settle into sustained contact.",
        line2: "Stillness can begin to feel unfamiliar.",
        line3: "That constant activation disrupts continuity."
      }

    default:
      return {
        line1: "You can recognise the pattern clearly.",
        line2: "The difficulty is what happens when continuity breaks.",
        line3: "That interruption tends to repeat automatically."
      }

  }

})

const goToProgramme = () => {
  router.push("/programme")
}
</script>