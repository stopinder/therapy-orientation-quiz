<template>
  <main class="min-h-screen bg-slate-50 px-6 py-16">

    ```
    <div
        v-if="!week"
        class="mx-auto max-w-4xl text-slate-500"
    >
      Week not found.
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
          Week {{ week.number }}
        </p>

        <h1 class="text-4xl font-semibold tracking-tight text-slate-950">
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

      <!-- Emerging Pattern Card (Week 1 Only) -->
      <section
          v-if="week.number === 1 && quizProfileSummary"
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <p class="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          Emerging Pattern
        </p>
        <div class="text-base leading-8 text-slate-700 whitespace-pre-line">
          {{ quizProfileSummary }}
        </div>
      </section>

      <section
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >

        <h2 class="text-2xl font-semibold text-slate-950">
          Opening reflection
        </h2>

        <div
            class="mt-5 space-y-5 text-base leading-8 text-slate-700"
        >

          <p
              v-for="paragraph in week.openingReflection"
              :key="paragraph"
          >
            {{ paragraph }}
          </p>

        </div>

      </section>

      <section
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >

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

      </section>

      <section
          class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
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

        <p
            v-if="restoredReflection"
            class="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600"
        >
          Previous continuity reflection restored.
        </p>

        <div
            v-if="quizProfileSummary"
            class="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-6"
        >
          <h3 class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Emerging Pattern
          </h3>
          <p class="text-base leading-7 text-slate-700 whitespace-pre-line">
            {{ quizProfileSummary }}
          </p>
        </div>

        <div
            v-if="week.number === 1"
            class="mb-10 rounded-2xl border border-blue-100 bg-blue-50/50 p-6"
        >
          <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-900">
            Week 1 Arrival
          </h3>
          <p class="text-base leading-7 text-blue-800">
            This week, we are becoming interested in the moment where continuity changes.
            Before you begin your reflection, take a moment to settle.
            Notice the transition from whatever you were doing before to this moment here.
          </p>
        </div>

        <p class="mt-4 text-base leading-7 text-slate-600">
          Describe a moment related to this week's continuity theme.
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
            What do you notice in your body as you recall this moment?
          </p>
          <textarea
              v-model="bodyObservation"
              rows="4"
              class="mt-4 w-full rounded-2xl border border-slate-300 bg-white p-4 text-base leading-7 text-slate-800 outline-none transition focus:border-slate-900"
              placeholder="What do you notice in your body as you recall this moment?"
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

      </section>

      <!-- Previous Reflections -->
      <section
          v-if="reflectionsHistory.length > 0"
          class="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h2 class="mb-6 text-2xl font-semibold text-slate-950">
          Previous Reflections
        </h2>

        <div class="space-y-6">
          <div
              v-for="item in reflectionsHistory"
              :key="item.id"
              class="rounded-2xl border border-slate-100 bg-slate-50/50 p-6"
          >
            <div class="mb-4 flex items-center justify-between">
              <span class="text-xs font-medium uppercase tracking-wider text-slate-400">
                {{ new Date(item.created_at).toLocaleDateString() }}
              </span>
            </div>

            <div class="space-y-4">
              <div>
                <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500">Your Reflection</h4>
                <p class="mt-2 text-sm leading-relaxed text-slate-700 whitespace-pre-line">{{ item.original_reflection }}</p>
              </div>

              <div v-if="item.ai_response">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500">MindWorks Response</h4>
                <p class="mt-2 text-sm leading-relaxed text-slate-700 whitespace-pre-line">{{ item.ai_response }}</p>
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

const reflectionsHistory = ref([])

const fetchReflectionsHistory = async () => {
  try {
    if (!auth.user?.id) return

    const result = await fetch("/api/getReflectionHistory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: auth.user.id })
    })

    const data = await result.json()
    if (data?.reflections) {
      // Filter for current week
      reflectionsHistory.value = data.reflections.filter(
          r => r.week_number === weekNumber.value
      )
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

            userId:
            auth.user.id

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
