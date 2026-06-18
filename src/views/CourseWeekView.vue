<template>
  <main class="min-h-screen bg-slate-50 px-6 py-16">

    ```
    <div
        v-if="!week"
        class="mx-auto max-w-4xl text-slate-500"
    >
      Stage not found.
    </div>

    <div
        v-else
        class="mx-auto max-w-4xl"
    >

      <div class="mb-12">

        <router-link
            to="/course"
            class="mb-8 inline-flex items-center text-sm text-slate-500 transition hover:text-slate-900"
        >
          Back to Course
        </router-link>

        <p class="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          Stage {{ week.number }}
        </p>

        <h1
            v-if="week.number !== 1"
            class="text-4xl font-semibold tracking-tight text-slate-950"
        >
          {{ week.title }}
        </h1>

        <p class="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
          {{ week.intro }}
        </p>

        <div
            v-if="showContinuityBoundary"
            class="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800"
        >
          Earlier continuity work still appears active. You can continue here,
          but returning to the earlier progression may strengthen continuity
          and recognition.
        </div>

      </div>

      <!-- Video Introduction Placeholder -->
      <section class="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 class="text-2xl font-semibold text-slate-950">
          Video Introduction
        </h2>
        <div class="mt-6 flex aspect-video items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <p class="max-w-xs text-sm text-slate-500">
            A short introduction from Rob explaining this stage's experiment and what to look for.
          </p>
        </div>
      </section>

      <!-- Orientation Section -->
      <section
          v-if="week.orientation"
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h2 class="text-2xl font-semibold text-slate-950">
          {{ week.orientation.title }}
        </h2>
        <div class="mt-5 space-y-5 text-base leading-8 text-slate-700">
          <p
              v-for="paragraph in week.orientation.content"
              :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
      </section>

      <!-- This Stage's Experiment (Week 1) -->
      <section
          v-if="week.number === 1"
          class="mb-16"
      >
        <h2 class="text-2xl font-semibold text-slate-950">
          This Stage's Experiment
        </h2>
        <div class="mt-8 space-y-6 text-xl leading-relaxed text-slate-800">
          <p>Before opening email, beginning work, or starting a task:</p>
          <p class="font-medium text-2xl text-slate-950">Sense both feet.</p>
          <p>Ask:</p>
          <p class="font-medium text-2xl text-slate-950">"What am I about to do?"</p>
          <p>Then continue normally.</p>
          <div class="mt-8 pt-6">
            <p class="text-base text-slate-600 italic">Do not try to change anything. Simply notice what happens.</p>
          </div>
        </div>
      </section>

      <!-- Emerging Pattern Card -->
      <section
          v-if="quizProfileSummary"
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <p class="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          {{ weekNumber === 1 ? 'Initial Observation Profile' : 'Emerging Pattern' }}
        </p>
        <div class="text-base leading-8 text-slate-700 whitespace-pre-line">
          {{ quizProfileSummary }}
        </div>
      </section>

      <!-- Continuity Observation (Evidence-Based Recurrence) -->
      <section
          v-if="showPatternBlock"
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <p class="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          {{ patternBlockLabel }}
        </p>

        <p class="mb-4 text-sm text-slate-500">
          {{ discoveryWording }}
        </p>

        <ul class="mb-8 space-y-3">
          <li
              v-for="(example, index) in topPattern.examples"
              :key="index"
              class="text-base text-slate-700 flex gap-3"
          >
            <span class="text-slate-400">•</span>
            <span>{{ example }}</span>
          </li>
        </ul>

        <div class="border-t border-slate-100 pt-6">
          <p class="mb-2 text-sm font-medium uppercase tracking-wider text-slate-500">
            {{ patternTypeLabel }}
          </p>
          <p class="text-lg font-medium text-slate-900">
            {{ stagePrimaryContent }}
          </p>
        </div>
      </section>

      <!-- Phase 1 Sequence Surface Prototype -->
      <section
          v-if="showSequenceBlock"
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <p class="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          {{ sequenceBlockLabel }}
        </p>
        <p class="mb-6 text-base text-slate-600">
          {{ sequenceBlockWording }}
        </p>

        <div v-if="weekNumber === 2" class="border-t border-slate-100 pt-6 mt-8">
          <p class="mb-4 text-sm font-medium uppercase tracking-wider text-slate-500">
            Current Sequence
          </p>
        </div>

        <div class="mt-8 inline-flex flex-col items-start gap-3">
          <template v-for="(step, index) in sequenceSteps" :key="index">
            <div class="flex h-10 items-center justify-center rounded-xl bg-slate-50 px-5 py-2 border border-slate-200">
              <span class="text-base font-medium text-slate-900">{{ step }}</span>
            </div>

            <div v-if="index < sequenceSteps.length - 1" class="flex w-full justify-center py-0.5 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </div>
          </template>
        </div>
      </section>

      <section
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >

        <div class="mb-8 flex items-center justify-between">

          <h2 class="text-2xl font-semibold text-slate-950">
            Reflect with MindWorks
          </h2>

          <div
              v-if="weekCompleted"
              class="rounded-full bg-emerald-100 px-4 py-2 text-xs font-medium text-emerald-700"
          >
            Reflection completed
          </div>

        </div>

        <div
            v-if="week.number === 1"
            class="mb-10 rounded-2xl border border-blue-100 bg-blue-50/50 p-6"
        >
          <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-900">
            Stage 1 Arrival
          </h3>
          <p class="text-base leading-7 text-blue-800">
            This stage, we are becoming interested in the moment where continuity changes.
            Before you begin your reflection, take a moment to settle.
            Notice the transition from whatever you were doing before to this moment here.
          </p>
        </div>

        <p
            class="mt-4 text-base leading-7 text-slate-600"
        >
          {{ week.reflectionPrompt }}
        </p>

        <textarea
            v-model="reflection"
            rows="8"
            class="mt-6 w-full rounded-2xl border border-slate-300 bg-white p-4 text-base leading-7 text-slate-800 outline-none transition focus:border-slate-900"
            placeholder="Describe what happened..."
        />

        <div class="mt-8">
          <p class="text-base font-medium text-slate-900">
            Body Observation
          </p>
          <p class="mt-1 text-sm text-slate-500">
            As you recall this moment, what do you notice in your body?
          </p>
          <textarea
              v-model="bodyObservation"
              rows="4"
              class="mt-4 w-full rounded-2xl border border-slate-300 bg-white p-4 text-base leading-7 text-slate-800 outline-none transition focus:border-slate-900"
              placeholder="Tightness...&#10;Restlessness...&#10;Heaviness...&#10;Nothing noticeable..."
          />
        </div>

        <button
            type="button"
            :disabled="loading || !reflection.trim()"
            @click="submitReflection"
            class="mt-5 rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {{ loading ? "Reflecting..." : "Generate reflection" }}
        </button>

        <div
            v-if="error"
            class="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700"
        >
          {{ error }}
        </div>

        <div
            v-if="response"
            class="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6"
        >

          <h3 class="mb-4 font-medium text-slate-950">
            Reflection
          </h3>

          <div
              class="whitespace-pre-line text-base leading-8 text-slate-700"
          >
            {{ response }}
          </div>

        </div>

        <div v-if="reflectionsHistory.length > 0" class="mt-12 border-t border-slate-100 pt-10">
          <h3 class="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Recent Reflections
          </h3>
          <div class="space-y-6">
            <div
                v-for="item in reflectionsHistory.slice(0, 3)"
                :key="item.id"
                class="rounded-2xl border border-slate-100 bg-slate-50/50 p-6"
            >
              <div class="mb-2 text-xs font-medium text-slate-400">
                {{ new Date(item.created_at).toLocaleDateString() }}
              </div>
              <p class="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                {{ item.original_reflection }}
              </p>
            </div>
          </div>
        </div>

      </section>

      <!-- Read More Accordion -->
      <section class="mb-10">
        <button
            @click="showReadMore = !showReadMore"
            class="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:bg-slate-50"
        >
          <span class="text-xl font-semibold text-slate-950">Why This Matters</span>
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-slate-400 transition-transform duration-200"
              :class="{ 'rotate-180': showReadMore }"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div
            v-if="showReadMore"
            class="mt-4 space-y-4"
        >
          <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 class="text-2xl font-semibold text-slate-950">
              Opening reflection
            </h2>
            <div class="mt-5 space-y-5 text-base leading-8 text-slate-700">
              <p
                  v-for="paragraph in week.openingReflection"
                  :key="paragraph"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>

          <div
              v-if="week.bodyFocus"
              class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <h2 class="text-2xl font-semibold text-slate-950">
              Including the Body
            </h2>
            <div class="mt-5 space-y-5 text-base leading-8 text-slate-700">
              <p
                  v-for="paragraph in week.bodyFocus"
                  :key="paragraph"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>

          <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 class="text-2xl font-semibold text-slate-950">
              Observation exercises
            </h2>
            <div class="mt-6 grid gap-4">
              <div
                  v-for="exercise in week.exercises"
                  :key="exercise.title"
                  class="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 class="font-medium text-slate-950">
                  {{ exercise.title }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  {{ exercise.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
    ```

  </main>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref
} from "vue"

import { useRoute }
  from "vue-router"

import { courseWeeks }
  from "../data/courseWeeks"

import { useAuthStore }
  from "../stores/auth"

import { useCourseProgressStore }
  from "../stores/courseProgress"

import { useContinuity }
  from "../composables/useContinuity"

import { supabase }
  from "../lib/supabase"

const route = useRoute()

const auth = useAuthStore()

const courseProgress =
    useCourseProgressStore()

const {
  isFutureBoundary
} = useContinuity()

const reflection = ref("")
const bodyObservation = ref("")
const response = ref("")
const loading = ref(false)
const error = ref("")

const restoredReflection =
    ref(false)

const quizProfileSummary =
    ref("")

const showReadMore = ref(false)

const reflectionsHistory = ref([])

const BEHAVIORAL_MAP = {
  'Something else repeatedly happens before beginning.': ['preparation', 'organising', 'organizing', 'planning', 'research', 'tidying'],
  'Attention drifts to digital tools or rituals before starting.': ['email', 'messages', 'messaging', 'scrolling', 'tea', 'coffee'],
  'Delay occurs immediately after an intention is formed.': ['delay', 'delayed', 'hesitation', 'hesitant', 'postponed', 'postponing'],
  'A verification ritual repeatedly precedes action.': ['checking', 'checked', 'rechecked', 'monitoring']
}

const recentThemes = computed(() => {
  if (!reflectionsHistory.value || reflectionsHistory.value.length === 0) return []

  const latestThree = reflectionsHistory.value.slice(0, 3)
  const categoryData = {}

  latestThree.forEach(item => {
    const text = (item.original_reflection || '').toLowerCase()
    const seenInThisReflection = new Set()

    Object.entries(BEHAVIORAL_MAP).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          seenInThisReflection.add(category)
        }
      })
    })

    seenInThisReflection.forEach(category => {
      if (!categoryData[category]) {
        categoryData[category] = {
          count: 0,
          examples: []
        }
      }
      categoryData[category].count += 1
      if (categoryData[category].examples.length < 3) {
        categoryData[category].examples.push(item.original_reflection)
      }
    })
  })

  return Object.entries(categoryData)
      .map(([category, data]) => ({
        name: category,
        count: data.count,
        examples: data.examples
      }))
      .sort((a, b) => b.count - a.count)
})

const topPattern = computed(() => {
  return recentThemes.value.length > 0 ? recentThemes.value[0] : null
})

const uniqueObservations = computed(() => {
  const allExamples = []
  recentThemes.value.forEach(theme => {
    theme.examples.forEach(example => {
      if (!allExamples.includes(example)) {
        allExamples.push(example)
      }
    })
  })
  return allExamples
})

const showPatternBlock = computed(() => {
  return weekNumber.value >= 3 && topPattern.value && topPattern.value.examples.length >= 2
})

const showSequenceBlock = computed(() => {
  return weekNumber.value >= 2 && topPattern.value && topPattern.value.examples.length >= 2
})

const patternBlockLabel = computed(() => {
  const n = weekNumber.value
  if (n === 3) return "What MindWorks Is Noticing"
  if (n === 4) return "State Becoming Visible"
  if (n === 5) return "Possible Function"
  if (n === 6) return "System Becoming Visible"
  return "What MindWorks Is Noticing"
})

const patternTypeLabel = computed(() => {
  const n = weekNumber.value
  if (n === 3) return "Possible Pattern"
  if (n === 4) return "Primary State"
  if (n === 5) return "Potential Function"
  if (n === 6) return "Systemic Relationship"
  return "Possible Pattern"
})

const discoveryWording = computed(() => {
  const n = weekNumber.value
  if (n === 3) return "Across recent reflections, a recurring structure is beginning to appear."
  if (n === 4) return "MindWorks is noticing the emotional climate and internal conditions that tend to precede this sequence: pressure, uncertainty, body context, or exposure."
  if (n === 5) return "This recurring sequence appears to accomplish something, though it is not yet clear. It may be providing relief, reducing uncertainty, or protecting continuity by creating a pause."
  if (n === 6) return "MindWorks is noticing relationships between patterns, specifically recurring protective responses and the states that appear under pressure."
  return "Across recent reflections:"
})

const stagePrimaryContent = computed(() => {
  const n = weekNumber.value
  if (n === 3) return topPattern.value?.name || ""
  if (n === 4) return "Pressure or uncertainty appears before checking, preparing, or delay."
  if (n === 5) return "Checking or preparing may create a pause, reduce uncertainty, delay exposure, or provide brief relief."
  if (n === 6) return "Similar responses appear around moments of pressure, exposure, or beginning: checking, preparing, delaying, and reorganising. The relationship between these responses is still being observed."
  return topPattern.value?.name || ""
})

const sequenceBlockLabel = computed(() => {
  const n = weekNumber.value
  if (n === 2) return "Sequence Becoming Visible"
  return "Most Common Sequence"
})

const sequenceBlockWording = computed(() => {
  const n = weekNumber.value
  if (n === 2) return "MindWorks is beginning to place events in order."
  return "A sequence appearing across recent reflections."
})

const sequenceSteps = computed(() => {
  const n = weekNumber.value
  if (n >= 4) {
    return [
      "Pressure / Uncertainty",
      "Checking / Preparing",
      "Delay"
    ]
  }
  return [
    "Intention",
    "Checking / Preparing",
    "Delay",
    "Recognition"
  ]
})

const fetchReflectionsHistory = async () => {
  try {
    if (!auth.user?.id) return

    const result = await fetch("/api/getReflectionHistory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: auth.user.id })
    })

    const data = await result.json()
    
    console.log("REFLECTIONS RECEIVED FROM API:", data?.reflections?.length || 0)
    
    if (data?.reflections) {
      reflectionsHistory.value = Array.isArray(data.reflections)
          ? data.reflections
          : []
          
      console.log("REFLECTIONS ASSIGNED TO HISTORY:", reflectionsHistory.value.length)
      console.log("COMPUTED RECENT THEMES:", JSON.stringify(recentThemes.value, null, 2))
    }
  } catch (err) {
    console.error("HISTORY ERROR:", err)
  }
}

const fetchQuizProfile =
    async () => {

      if (!auth.user?.email) {
        return
      }

      const { data } = await supabase
          .from("quiz_submissions")
          .select("quiz_profile_summary")
          .eq("email", auth.user.email)
          .maybeSingle()

      if (data) {
        quizProfileSummary.value =
            data.quiz_profile_summary
      }

    }

const weekNumber = computed(() =>
    Number(route.params.weekNumber)
)

const week = computed(() =>
    courseWeeks.find(
        (item) =>
            item.number ===
            weekNumber.value
    )
)

const weekCompleted =
    computed(() =>
        courseProgress.isWeekCompleted(
            weekNumber.value
        )
    )

const showContinuityBoundary =
    computed(() => {

      return isFutureBoundary(
          weekNumber.value
      )

    })

const restorePreviousReflection =
    async () => {

      try {

        if (!auth.user?.id) {
          return
        }

        const result = await fetch(
            "/api/getCourseReflection",
            {
              method: "POST",

              headers: {
                "Content-Type":
                    "application/json"
              },

              body: JSON.stringify({

                userId:
                auth.user.id,

                week:
                weekNumber.value

              })
            }
        )

        const data =
            await result.json()

        if (
            data?.reflection
        ) {

          // reflection.value =
          //     data.reflection
          //         .original_reflection || ""

          response.value =
              data.reflection
                  .ai_response || ""

          restoredReflection.value =
              true

        }

      } catch (err) {

        console.error(
            "RESTORE ERROR:",
            err
        )

      }

    }

onMounted(async () => {

  if (
      auth.user?.id &&
      weekNumber.value
  ) {

    await courseProgress.markWeekStarted(
        auth.user.id,
        weekNumber.value,
        "week-entry"
    )

    await fetchQuizProfile()

    await restorePreviousReflection()

    await fetchReflectionsHistory()

  }

})

const submitReflection = async () => {

  error.value = ""

  // Quality Gate
  const content = reflection.value.trim().toLowerCase()
  const gibberish = ['asdf', 'sdfadg', 'qwerty', 'zxcv', 'jkl;']
  const hasGibberish = gibberish.some(pattern => content.includes(pattern))

  if (content.length < 20 || !content.includes(' ') || hasGibberish) {
    error.value = "Please describe the experience in a little more detail before generating a reflection."
    return
  }

  response.value = ""
  loading.value = true

  try {

    if (!auth.user?.id) {

      throw new Error(
          "User not authenticated"
      )

    }

    const result = await fetch(
        "/api/courseReflection",
        {
          method: "POST",

          headers: {
            "Content-Type":
                "application/json"
          },

          body: JSON.stringify({

            week:
            weekNumber.value,

            reflection:
            reflection.value,

            bodyObservation:
            bodyObservation.value,

            userId:
            auth.user.id,

            email:
            auth.user.email

          })
        }
    )

    const text =
        await result.text()

    let data = {}

    try {

      data = text
          ? JSON.parse(text)
          : {}

    } catch {

      throw new Error(
          "Invalid server response"
      )

    }

    if (!result.ok) {

      throw new Error(
          data.error ||
          "Reflection generation failed."
      )

    }

    response.value =
        data.reflection || ""

    reflection.value = ""
    bodyObservation.value = ""

    await courseProgress
        .markWeekCompleted(
            auth.user.id,
            weekNumber.value
        )

    await fetchReflectionsHistory()

  } catch (err) {

    error.value =
        err.message ||
        "Something went wrong."

  } finally {

    loading.value = false

  }

}
</script>
