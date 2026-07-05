<template>
  <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 pt-10 pb-24 font-sans antialiased">
    <div class="max-w-2xl mx-auto px-4 mt-10">

      <header class="mb-10">
        <p class="text-sm text-gray-600 mb-4">
          MindWorks Orientation
        </p>

        <h1 class="text-3xl md:text-4xl font-medium mb-4">
          Some things only become visible across time.
        </h1>

        <div class="text-base md:text-lg">
          <p class="mb-3">
            The Free Orientation introduces the way MindWorks helps recurring patterns become visible through repeated observation.
          </p>
          <p class="mb-3">
            There are no scores.
            There are no labels.
            Just a place to begin.
          </p>
        </div>
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
              class="scroll-mt-52 md:scroll-mt-36 text-[1.3rem] leading-[1.7] text-stone-800"
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
            v-if="activeText"
            ref="reportContainerRef"
            class="mx-auto mt-12 max-w-prose scroll-mt-36"
        >
          <div
              v-if="!emailSubmitted"
              class="mb-10 rounded-2xl border border-stone-200 bg-white/80 p-8"
          >
            <div class="space-y-6">
              <div class="mb-4">
                <h3 class="text-xl md:text-2xl font-medium mb-4">
                  Continue with the orientation
                </h3>

                <div class="text-base md:text-lg">
                  <p class="mb-3">
                    Receive the complete orientation and downloadable summary.
                  </p>

                  <p class="mb-3">
                    The aim is not diagnosis or performance.
                    It is clearer recognition of how patterns begin to appear in everyday life.
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
                Receive orientation summary
              </button>
            </div>
          </div>

          <div v-if="emailSubmitted">
            <div class="sticky top-16 z-30 mb-8 border-y border-stone-200 bg-stone-50/95 py-6 backdrop-blur">
              <div class="mx-auto max-w-2xl text-center mb-6">
                <h3 class="text-sm font-medium text-slate-900 mb-1">Explore your report</h3>
                <p class="text-xs text-slate-500">Your report is organised into three sections. Select a section to explore different perspectives.</p>
              </div>
              <div class="flex justify-center">
                <div class="inline-flex p-1 bg-stone-100 rounded-full border border-stone-200">
                  <button
                      v-for="view in views"
                      :key="view.key"
                      @click="selectView(view.key)"
                      class="rounded-full px-6 py-2 text-sm font-medium transition-all duration-200"
                      :class="activeView === view.key
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5'
                      : 'text-slate-500 hover:text-slate-700'"
                  >
                    {{ view.label }}
                  </button>
                </div>
              </div>
            </div>

            <transition name="fade" mode="out-in">
              <div :key="activeView">
                <div class="mb-10">
                  <h2 class="text-xl md:text-2xl font-medium mb-4">
                    {{ activeViewLabel }}
                  </h2>

                  <p class="text-base md:text-lg mb-3">
                    {{ activeViewIntro }}
                  </p>
                </div>

                <div v-html="formattedActiveText"></div>
              </div>
            </transition>

            <div
                v-if="reportTexts.tldr"
                class="mt-16 rounded-2xl border border-slate-200 bg-slate-100 p-8"
            >
              <h2 class="mb-4 text-[1.35rem] font-medium text-slate-900">
                TL;DR
              </h2>

              <div
                  class="text-[1rem] leading-[1.85] text-slate-700"
                  v-html="formattedTldrText"
              ></div>
            </div>

            <div class="mt-12 flex justify-center">
              <button
                  @click="downloadReflection"
                  class="rounded-xl border border-slate-900 bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Download orientation
              </button>
            </div>

            <div
                v-if="downloadComplete"
                class="mt-4 text-center text-sm text-slate-500"
            >
              Orientation downloaded.
            </div>

            <div
                v-if="showNextStep"
                class="mx-auto mt-20 max-w-2xl space-y-6 text-center"
            >
              <div class="space-y-5 text-[1rem] leading-[1.9] text-slate-700">
                <p>{{ adaptiveMessage.line1 }}</p>
                <p>{{ adaptiveMessage.line2 }}</p>
                <p>{{ adaptiveMessage.line3 }}</p>
              </div>

              <div class="space-y-4 pt-2">
                <p class="mx-auto max-w-xl text-[1rem] leading-[1.8] text-slate-600">
                  {{ programmeIntro }}
                </p>

                <button
                    @click="goToProgramme"
                    class="rounded-xl border border-slate-900 bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Continue to the programme
                </button>
              </div>
            </div>

            <!-- New CTA Section -->
            <div class="mt-24 rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
              <h2 class="mb-4 text-2xl font-semibold tracking-tight text-slate-950">
                Ready to Go Deeper?
              </h2>

              <p class="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-slate-600">
                The orientation introduces pattern recognition. The MindWorks programme helps you work with those patterns over time through guided reflection and continuity tracking.
              </p>

              <button
                  @click="enterProgrammeFromQuiz"
                  class="inline-block rounded-xl bg-slate-900 px-8 py-4 text-base font-medium text-white transition hover:bg-slate-800"
              >
                Start the MindWorks programme
              </button>
            </div>
          </div>
        </div>

      </section>

      <BackToTopButton />
    </div>
  </main>
</template>

<script setup>
import { useAuthStore } from "../stores/auth"
import { computed, nextTick, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../lib/supabase"
import BackToTopButton from "../components/BackToTopButton.vue"

import { adhdQuestions } from "../quiz/adhd/questions.js"
import { buildBehaviourProfile } from "../quiz/adhd/buildBehaviourProfile.js"

const router = useRouter()
const auth = useAuthStore()
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
    intro: "How the pattern tends to appear moment to moment."
  },
  {
    key: "functioning",
    label: "Daily life",
    intro: "How the pattern gathers across ordinary responsibilities."
  },
  {
    key: "patterns",
    label: "Patterns",
    intro: "The recurring sequences that keep the cycle going."
  }
]

const activeView = ref("overview")

const questionTextRefs = ref([])
const loadingContainerRef = ref(null)
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

const behaviourProfile = computed(() => {
  return buildBehaviourProfile(answers.value)
})

const handleAnswer = async (
    questionId,
    value,
    index
) => {
  answers.value[questionId] = value

  await nextTick()

  const nextQuestion =
      questionTextRefs.value[index + 1]

  if (nextQuestion) {
    nextQuestion.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })

    return
  }

  if (
      quizComplete.value &&
      !loading.value &&
      !reportReady.value
  ) {
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
  const response = await fetch(
      "/api/expand-report-v2",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          profile: behaviourProfile.value,
          userId: auth.user?.id,
          email: email.value
        })
      }
  )

  const raw = await response.text()

  if (!response.ok) {
    console.error("API ERROR:", raw)

    throw new Error(
        `API failed with status ${response.status}`
    )
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

  loadingStage.value =
      "Noticing behavioural patterns..."

  try {
    await new Promise(resolve =>
        setTimeout(resolve, 700)
    )

    loadingStage.value =
        "Mapping familiar sequences..."

    await new Promise(resolve =>
        setTimeout(resolve, 700)
    )

    loadingStage.value =
        "Generating reflection..."

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
    profile: behaviourProfile.value,
    reports: reportTexts.value
  }

  localStorage.setItem(
      "mindworks_latest_reflection",
      JSON.stringify(reflectionData)
  )
}

const unlockReport = async () => {
  emailError.value = ""

  if (
      !email.value ||
      !email.value.includes("@")
  ) {
    emailError.value =
        "Please enter a valid email address."

    return
  }

  try {
    const response = await fetch(
        "/api/capture-email",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

           body: JSON.stringify({
             email: email.value,
             profile: behaviourProfile.value
           })
        }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
          data.error || "Failed"
      )
    }

    emailSubmitted.value = true

    await nextTick()

    window.scrollTo({
      top:
          reportContainerRef.value.offsetTop - 100,
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

  if (!reportContainerRef.value) return

  const targetY =
      reportContainerRef.value
          .getBoundingClientRect().top +
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
    views.find(v =>
        v.key === activeView.value
    )?.label || ""
)

const activeViewIntro = computed(() =>
    views.find(v =>
        v.key === activeView.value
    )?.intro || ""
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

  const lines =
      reportTexts.value.tldr
          .split("\n")
          .map(line => line.trim())
          .filter(Boolean)

  const looksLikeBullets =
      lines.some(line =>
          /^[-*•]\s+/.test(line)
      )

  if (looksLikeBullets) {
    const items = lines
        .map(line => {
          const safeLine =
              allowBasicFormatting(
                  escapeHtml(
                      normaliseBulletLine(line)
                  )
              )

          return `<li>${safeLine}</li>`
        })
        .join("")

    return `
      <ul class="space-y-3 list-disc pl-5">
        ${items}
      </ul>
    `
  }

  const safeText =
      allowBasicFormatting(
          escapeHtml(reportTexts.value.tldr)
      )

  return `<p>${safeText}</p>`
})

const formattedActiveText = computed(() => {
  if (!activeText.value) return ""

  return activeText.value
      .split("\n\n")
      .map(p => {
        const safeParagraph =
            allowBasicFormatting(
                escapeHtml(p)
            )

        return `
          <p class="mb-3 text-base md:text-lg text-stone-800">
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
        const safeParagraph =
            allowBasicFormatting(
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

  const looksLikeBullets =
      lines.some(line =>
          /^[-*•]\s+/.test(line)
      )

  if (looksLikeBullets) {
    const items = lines
        .map(line => {
          const safeLine =
              allowBasicFormatting(
                  escapeHtml(
                      normaliseBulletLine(line)
                  )
              )

          return `<li>${safeLine}</li>`
        })
        .join("")

    return `<ul>${items}</ul>`
  }

  const safeText =
      allowBasicFormatting(
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

    <h1>MindWorks Orientation</h1>

<p>
Behavioural patterns, recurring sequences, and emerging continuity.
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
        {
          type: "text/html;charset=utf-8"
        }
    )

    const url =
        URL.createObjectURL(blob)

    const link =
        document.createElement("a")

    link.href = url
    link.download =
        "mindworks-orientation.html"

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
    console.error(
        "Download failed:",
        err
    )

    alert("Download failed.")
  }
}

const adaptiveMessage = computed(() => {
  const profile =
      behaviourProfile.value

  if (profile.veryLowSignal) {
    return {
      line1:
          "No strong continuity pattern emerged from these responses.",
      line2:
          "The reflection remains limited because the behavioural signal is low.",
      line3:
          "That absence is still useful information."
    }
  }

  if (
      profile.responseStyle ===
      "minimal_endorsement"
  ) {
    return {
      line1:
          "The responses did not show a consolidated interruption pattern.",
      line2:
          "There may be occasional friction, but not a strong continuity failure.",
      line3:
          "The next step is only relevant if the reflection still felt recognisable."
    }
  }

  if (
      profile.responseStyle ===
      "low_frequency_recognition"
  ) {
    return {
      line1:
          "The signal is present, but not strongly consolidated.",
      line2:
          "Continuity may break in specific contexts rather than across the whole day.",
      line3:
          "Those smaller breaks can still be worth observing directly."
    }
  }

  const profileKey =
      profile.profiles?.[0]?.key

  switch (profileKey) {
    case "pressure_sustained_functioning":
      return {
        line1:
            "Pressure temporarily stabilises movement.",
        line2:
            "Without urgency, continuity weakens more quickly.",
        line3:
            "That cycle often creates exhaustion without real stability."
      }

    case "fragmented_completion":
      return {
        line1:
            "Tasks remain mentally active long after attention has drifted.",
        line2:
            "Progress repeatedly fragments before completion settles.",
        line3:
            "That unfinished carryover quietly accumulates."
      }

    case "restart_loop_instability":
      return {
        line1:
            "Momentum repeatedly resets before becoming fully established.",
        line2:
            "Restarting creates movement without preserving continuity.",
        line3:
            "The cycle repeats even with strong intention."
      }

    case "internally_accelerated_functioning":
      return {
        line1:
            "Internal movement rarely settles fully.",
        line2:
            "Mental acceleration continues even during rest.",
        line3:
            "Sustained continuity becomes harder to stabilise over time."
      }

    case "high_effort_stagnation":
      return {
        line1:
            "Effort remains high while completion stays unstable.",
        line2:
            "Activity can create the feeling of progress without enough closure.",
        line3:
            "That gap quietly drains attention."
      }

    case "fragmented_attention_flow":
      return {
        line1:
            "Attention moves faster than continuity can stabilise.",
        line2:
            "Shifts in focus repeatedly interrupt the intended line of action.",
        line3:
            "Completion becomes harder when every movement opens another direction."
      }

    case "emotionally_disrupted_continuity":
      return {
        line1:
            "Emotional friction interrupts continuity before the task is complete.",
        line2:
            "Once activated, attention becomes harder to return deliberately.",
        line3:
            "The task remains present, but steadiness does not fully return."
      }

    default:
      return {
        line1:
            "Interrupted continuity appears more consistently than stable progression.",
        line2:
            "Attention and effort repeatedly separate from intended direction.",
        line3:
            "That instability gradually reshapes daily functioning."
      }
  }
})

const programmeIntro = computed(() => {
  const profile =
      behaviourProfile.value

  if (
      profile.veryLowSignal ||
      profile.responseStyle === "minimal_endorsement"
  ) {
    return "The six-stage guided path is designed for people who recognise recurring continuity breaks strongly enough to observe them in real time."
  }

  if (
      profile.responseStyle ===
      "low_frequency_recognition"
  ) {
    return "The six-stage guided path continues this work through structured observation of the specific contexts where continuity begins to break."
  }

  return "The six-stage guided path continues this work through structured observation, embodied attention practices, and continuity exercises."
})

const goToProgramme = () => {
  router.push("/programme")
}

const enterProgrammeFromQuiz = async () => {
  let checkoutUrl = "https://gpttherapyassist.lemonsqueezy.com/checkout/buy/3d1439e1-bbba-4fc9-8810-04cdda84ca89"

  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    router.push("/auth")
    return
  }

  const email = user.email.trim().toLowerCase()
  console.log("Checkout user email:", email)

  try {
    const url = new URL(checkoutUrl)
    url.searchParams.set('checkout[email]', email)
    url.searchParams.set('custom[email]', email)
    checkoutUrl = url.toString()
  } catch (e) {
    console.error("Error constructing checkout URL:", e)
  }

  window.location.href = checkoutUrl
}
</script>