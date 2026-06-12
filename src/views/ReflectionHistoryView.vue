```vue
<template>
  <main class="min-h-screen bg-slate-50 px-6 py-16">

    <div class="mx-auto max-w-5xl">

      <!-- Header -->

      <div class="mb-14">

        <p class="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          Continuity History
        </p>

        <h1 class="text-4xl font-semibold tracking-tight text-slate-950">
          Reflection Timeline
        </h1>

        <p class="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
          A longitudinal view of recurring behavioural themes,
          interruption patterns, continuity shifts, and reflective
          observations across the programme.
        </p>

      </div>

      <!-- Discovery Layer v1 — prototype -->
      <section class="mb-16">
        <div class="overflow-hidden rounded-[2.5rem] border border-slate-900 bg-slate-900 p-10 text-white shadow-2xl">
          <div class="max-w-3xl">
            <p class="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              MindWorks Discovery
            </p>

            <p class="mb-8 text-lg text-slate-300">
              Across recent reflections, the same movement appears in different forms.
            </p>

            <div class="mb-10 flex flex-col items-start gap-3">
              <div class="text-xl font-medium text-slate-100">Beginning</div>
              <div class="flex w-full justify-start px-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500">
                  <path d="M12 5v14" /><path d="m19 12-7 7-7-7" />
                </svg>
              </div>
              <div class="text-xl font-medium text-slate-100">Substitution</div>
              <div class="flex w-full justify-start px-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500">
                  <path d="M12 5v14" /><path d="m19 12-7 7-7-7" />
                </svg>
              </div>
              <div class="text-xl font-medium text-slate-100">Delay</div>
            </div>

            <div class="space-y-1 border-t border-white/10 pt-8">
              <p class="text-lg text-slate-300">
                The activity changes.
              </p>
              <p class="text-lg text-slate-300 font-medium">
                The sequence remains similar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Continuity Observation (Evidence-Based Recurrence) -->
      <section
          v-if="topPattern"
          class="mb-16"
      >
        <div class="overflow-hidden rounded-[2.5rem] border border-slate-900 bg-slate-900 p-10 text-white shadow-2xl">
          <div class="max-w-3xl">
            <p class="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              What MindWorks Is Noticing
            </p>

            <p class="mb-4 text-lg text-slate-300">
              Across recent reflections:
            </p>

            <ul class="mb-10 space-y-4">
              <li
                  v-for="(example, index) in topPattern.examples"
                  :key="index"
                  class="flex gap-4 text-lg text-slate-200"
              >
                <span class="text-slate-500">•</span>
                <span>{{ example }}</span>
              </li>
            </ul>

            <div class="border-t border-white/10 pt-8">
              <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                Possible Pattern
              </p>
              <h2 class="text-3xl font-semibold tracking-tight text-white">
                {{ topPattern.name }}
              </h2>
            </div>
          </div>
        </div>
      </section>

      <!-- Phase 3 Continuity Surface — Sequence Prototype -->

      <section
          v-if="topPattern"
          class="mb-16"
      >

        <div class="overflow-hidden rounded-[2.5rem] border border-slate-900 bg-slate-900 p-10 text-white shadow-2xl">

          <div class="max-w-3xl">

            <p class="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Primary Insight
            </p>

            <h2 class="text-3xl font-semibold tracking-tight">
              Most Common Sequence
            </h2>

            <p class="mt-4 text-lg text-slate-300">
              A sequence that has appeared repeatedly across recent reflections.
            </p>

            <div class="mt-10 inline-flex flex-col items-start gap-4">

              <div class="flex items-center gap-4">
                <div class="flex h-12 w-48 items-center justify-center rounded-2xl bg-white/10 px-6 py-3 border border-white/10">
                  <span class="text-lg font-medium text-slate-100">Intention</span>
                </div>
              </div>

              <div class="flex w-48 justify-center py-1">
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
                    class="text-slate-500"
                >
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </div>

              <div class="flex items-center gap-4">
                <div class="flex h-12 w-48 items-center justify-center rounded-2xl bg-white/10 px-6 py-3 border border-white/10">
                  <span class="text-lg font-medium text-slate-100">Checking</span>
                </div>
              </div>

              <div class="flex w-48 justify-center py-1">
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
                    class="text-slate-500"
                >
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </div>

              <div class="flex items-center gap-4">
                <div class="flex h-12 w-48 items-center justify-center rounded-2xl bg-white/10 px-6 py-3 border border-white/10">
                  <span class="text-lg font-medium text-slate-100">Delay</span>
                </div>
              </div>

              <div class="flex w-48 justify-center py-1">
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
                    class="text-slate-500"
                >
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </div>

              <div class="flex items-center gap-4">
                <div class="flex h-12 w-48 items-center justify-center rounded-2xl bg-white/10 px-6 py-3 border border-white/10">
                  <span class="text-lg font-medium text-slate-100">Recognition</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      <!-- Possible Function -->
      <section
          v-if="topPattern && possibleFunctionQuestion"
          class="mb-16"
      >
        <div class="rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm">
          <div class="max-w-3xl">
            <p class="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Possible Function
            </p>

            <h2 class="text-3xl font-semibold tracking-tight text-slate-900 mb-6">
              {{ possibleFunctionQuestion }}
            </h2>

            <p class="text-lg text-slate-600">
              A recurring sequence may be serving a function.
              Stay with the question rather than looking for an immediate answer.
            </p>
          </div>
        </div>
      </section>

      <!-- What Changed Afterwards? -->
      <section
          v-if="topPattern"
          class="mb-16"
      >
        <div class="rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm">
          <div class="max-w-3xl">
            <p class="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              What Changed Afterwards?
            </p>

            <p class="mb-6 text-lg text-slate-600">
              Looking across these reflections, notice what happened after the sequence unfolded.
            </p>

            <ul class="mb-8 space-y-4">
              <li class="flex gap-4 text-lg text-slate-600">
                <span class="text-slate-400">•</span>
                <span>Did anything become easier?</span>
              </li>
              <li class="flex gap-4 text-lg text-slate-600">
                <span class="text-slate-400">•</span>
                <span>Did pressure reduce?</span>
              </li>
              <li class="flex gap-4 text-lg text-slate-600">
                <span class="text-slate-400">•</span>
                <span>Did uncertainty reduce?</span>
              </li>
              <li class="flex gap-4 text-lg text-slate-600">
                <span class="text-slate-400">•</span>
                <span>Did something no longer need to be faced?</span>
              </li>
              <li class="flex gap-4 text-lg text-slate-600">
                <span class="text-slate-400">•</span>
                <span>Did attention move elsewhere?</span>
              </li>
            </ul>

            <p class="text-sm font-medium italic text-slate-500">
              The function of a recurring sequence is often revealed by what changes after it begins.
            </p>
          </div>
        </div>
      </section>

      <!-- Loading -->

      <div
          v-if="loading"
          class="text-slate-500"
      >
        Restoring continuity history...
      </div>

      <!-- Empty -->

      <div
          v-else-if="!reflections.length"
          class="rounded-3xl border border-slate-200 bg-white p-10 text-slate-500 shadow-sm"
      >
        No reflections recorded yet.
      </div>

      <!-- Timeline -->


      <div
          v-else
          class="space-y-8"
      >

        <!-- Phase 4 Continuity Surface — Archive Collapse -->
        <button
            @click="isArchiveCollapsed = !isArchiveCollapsed"
            class="group flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:bg-slate-50 shadow-sm"
        >
          <span class="text-lg font-semibold text-slate-900">
            View Reflection Archive ({{ reflections.length }} reflections)
          </span>
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
              :class="{ 'rotate-180': !isArchiveCollapsed }"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <div
            v-if="!isArchiveCollapsed"
            class="space-y-8"
        >

          <section
              v-for="item in reflections"
              :key="item.id"
              class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          >

          <!-- Meta -->

          <div class="mb-6 flex flex-wrap items-center justify-between gap-4">

            <div>

              <p class="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                Week {{ item.week_number }}
              </p>

              <h2 class="mt-2 text-2xl font-semibold text-slate-950">
                {{ getWeekTitle(item.week_number) }}
              </h2>

            </div>

            <div
                class="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600"
            >
              {{ formatDate(item.created_at) }}
            </div>

          </div>

          <!-- Original Reflection -->

          <div class="mb-8">

            <h3 class="mb-3 text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
              Original Reflection
            </h3>

            <div
                class="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base leading-8 text-slate-700"
            >
              {{ item.original_reflection }}
            </div>

          </div>

          <!-- AI Reflection -->

          <div>

            <h3 class="mb-3 text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
              MindWorks Reflection
            </h3>

            <div
                class="rounded-2xl border border-slate-200 bg-white p-5 text-base leading-8 text-slate-700 whitespace-pre-line"
            >
              {{ item.ai_response }}
            </div>

          </div>

        </section>

      </div>

    </div>

  </div>

</main>
</template>

  <script setup>
import {
  computed,
  onMounted,
  ref
} from "vue"

import { useAuthStore }
  from "../stores/auth"

import { courseWeeks }
  from "../data/courseWeeks"

const BEHAVIORAL_MAP = {
  'Something else repeatedly happens before beginning.': ['preparation', 'organising', 'organizing', 'planning', 'research', 'tidying'],
  'Attention drifts to digital tools or rituals before starting.': ['email', 'messages', 'messaging', 'scrolling', 'tea', 'coffee'],
  'Delay occurs immediately after an intention is formed.': ['delay', 'delayed', 'hesitation', 'hesitant', 'postponed', 'postponing'],
  'A verification ritual repeatedly precedes action.': ['checking', 'checked', 'rechecked', 'monitoring']
}

const isArchiveCollapsed = ref(true)

const auth =
    useAuthStore()

const reflections =
    ref([])

const loading =
    ref(true)

const recentThemes = computed(() => {
  if (!reflections.value || reflections.value.length === 0) return []

  const latestThree = reflections.value.slice(0, 3)
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
  return recentThemes.value.length > 0 && recentThemes.value[0].count >= 2
      ? recentThemes.value[0]
      : null
})

const possibleFunctionQuestion = computed(() => {
  if (!topPattern.value) return null

  const questions = {
    'Something else repeatedly happens before beginning.': 'What becomes easier when beginning is postponed?',
    'Attention drifts to digital tools or rituals before starting.': 'What might this sequence be helping you postpone?',
    'Delay occurs immediately after an intention is formed.': 'What no longer has to be faced when entry is delayed?',
    'A verification ritual repeatedly precedes action.': 'What becomes easier once this sequence unfolds?'
  }

  return questions[topPattern.value.name] || 'What might this sequence be helping you postpone?'
})

const fetchContinuitySummary =
    async () => {

      try {

        if (!auth.user?.id) return

        const result = await fetch(
            "/api/getContinuitySummary",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                userId: auth.user.id
              })
            }
        )

        const data = await result.json()
        continuitySummary.value = data.summary || ""

      } catch (err) {

        console.error("CONTINUITY SUMMARY ERROR:", err)

      }

    }

const getWeekTitle =
    (weekNumber) => {

      const week =
          courseWeeks.find(
              (item) =>
                  item.number ===
                  weekNumber
          )

      return (
          week?.title ||
          "Unknown Week"
      )

    }

const formatDate =
    (dateString) => {

      return new Date(
          dateString
      ).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "long",
            day: "numeric"
          }
      )

    }

const loadReflections =
    async () => {

      try {

        if (
            !auth.user?.id
        ) {
          return
        }

        const result = await fetch(
            "/api/getReflectionHistory",
            {
              method: "POST",

              headers: {
                "Content-Type":
                    "application/json"
              },

              body: JSON.stringify({

                userId:
                auth.user.id

              })
            }
        )

        const data =
            await result.json()

        reflections.value =
            data.reflections || []

      } catch (err) {

        console.error(
            "TIMELINE ERROR:",
            err
        )

      } finally {

        loading.value =
            false

      }

    }

onMounted(async () => {

  await Promise.all([
    loadReflections(),
    fetchContinuitySummary()
  ])

})
</script>
```
