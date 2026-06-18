```vue
<template>
  <main class="min-h-screen bg-slate-50 px-6 py-16">

    <div class="mx-auto max-w-5xl">

      <!-- Header -->

      <div class="mb-14">

        <p class="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          Visibility Path Summary
        </p>

        <h1 class="text-4xl font-semibold tracking-tight text-slate-950">
          Accumulated Observations
        </h1>

        <p class="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
          MindWorks looks across your reflections to show what is becoming visible over time.
        </p>

      </div>

      <!-- Discovery Layer v1 — prototype -->
      <section class="mb-16">
        <div class="overflow-hidden rounded-[2.5rem] border border-slate-900 bg-slate-900 p-10 text-white shadow-2xl">
          <div class="max-w-3xl">
            <p class="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Visibility Summary
            </p>

            <div v-if="continuitySummary">
              <p class="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                What is becoming visible
              </p>
              <div class="whitespace-pre-line text-lg leading-relaxed text-slate-300">
                {{ continuitySummary }}
              </div>
              <p class="mt-5 text-sm leading-relaxed text-slate-500">
                This is not a conclusion. It is what MindWorks is beginning to notice across recent observations.
              </p>
            </div>

            <div v-else>
              <p class="text-lg leading-relaxed text-slate-300">
                MindWorks is beginning to gather enough observations to notice recurring structures. Continue adding reflections and this section will become more specific.
              </p>
            </div>
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
            View Recent Observations
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
            class="space-y-3"
        >
          <p class="text-xs text-slate-500 mb-4">
            Showing latest 10 observations
          </p>

          <section
              v-for="item in visibleArchiveReflections"
              :key="item.id"
              class="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm"
          >

          <!-- Metadata row -->
          <p class="text-sm text-slate-500 leading-relaxed">
            Stage {{ item.week_number }}&nbsp;·&nbsp;{{ getWeekTitle(item.week_number) }}&nbsp;·&nbsp;{{ formatDate(item.created_at) }}
          </p>

          <!-- Original Reflection -->
          <div class="mt-3">
            <h3 class="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Original observation
            </h3>
            <div class="mt-1 text-base leading-relaxed text-slate-800">
              {{ item.original_reflection }}
            </div>
          </div>

          <!-- AI Reflection Collapsible -->
          <details class="group mt-3">
            <summary class="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-open:rotate-180">
                <path d="m6 9 6 6 6-6"/>
              </svg>
              View MindWorks Reflection
            </summary>
            <div class="mt-4 rounded-xl bg-slate-50 p-6 text-base leading-relaxed text-slate-600 whitespace-pre-line">
              {{ item.ai_response }}
            </div>
          </details>

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
  ref,
  watch
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

const visibleArchiveReflections = computed(() => {
  return reflections.value.slice(0, 10)
})

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

const continuitySummary = ref("")

const fetchContinuitySummary =
    async () => {

      try {

        if (!auth.user?.id) return

        console.log("Fetching continuity summary for:", auth.user.id)

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
        console.log("Continuity summary received:", data.summary)
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
          "Unknown Stage"
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

      console.log("ReflectionHistory auth user id:", auth.user?.id)

      try {

        if (
            !auth.user?.id
        ) {
          return
        }

        console.log("Loading reflection history for:", auth.user?.id)

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

        console.log("Reflections received:", data.reflections?.length || 0)

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

watch(
  () => auth.user?.id,
  (userId) => {
    if (userId && reflections.value.length === 0) {
      loadReflections()
    }
  },
  { immediate: true }
)

onMounted(async () => {

  if (auth.user?.id) {
    await Promise.all([
      loadReflections(),
      fetchContinuitySummary()
    ])
  } else {
    // Summary also needs auth.user.id
    watch(
      () => auth.user?.id,
      (userId) => {
        if (userId) {
          fetchContinuitySummary()
        }
      },
      { once: true }
    )
  }

})
</script>
```
