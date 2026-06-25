<template>
  <div class="mx-auto max-w-6xl px-6 py-16">

    <!-- Header -->

    <div class="mb-14">

      <div
          v-if="hasProgrammeAccess && lastActiveWeek"
          class="mb-6 inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600"
      >
        Last active: Stage {{ lastActiveWeek }}
      </div>

      <div class="flex items-center justify-between">
        <h1 class="text-4xl font-semibold tracking-tight">
          Your Visibility Path
        </h1>

        <router-link
            to="/continuity"
            class="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
        >
          View Continuity History
        </router-link>
      </div>

      <p class="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
        A six-stage path for seeing interruptions, sequences, patterns,
        states, functions, and systems more clearly over time.
      </p>

    </div>

    <!-- Patterns Across Time / Continuity Entry -->

    <div
        class="mb-14 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div v-if="summaryLoading" class="flex items-center justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800"></div>
      </div>

      <div v-else-if="continuitySummary">
        <h2 class="mb-6 text-2xl font-semibold text-slate-900">
          What is becoming visible
        </h2>
        
        <div class="space-y-8">
          <div 
            v-for="(section, idx) in parsedSummary" 
            :key="idx"
          >
            <h4 v-if="section.title && section.title !== 'What is becoming visible'" class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {{ section.title }}
            </h4>
            <div 
              v-if="section.title === 'What is becoming visible' || !section.title" 
              class="text-xl font-medium text-slate-900 leading-relaxed mb-8"
            >
              {{ section.content }}
            </div>
            <div v-else class="whitespace-pre-line text-lg leading-relaxed text-slate-600">
              {{ section.content }}
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-end">
          <router-link
              to="/continuity"
              class="text-sm font-medium text-slate-500 hover:text-slate-900 transition underline underline-offset-4"
          >
            View Full Continuity History
          </router-link>
        </div>
      </div>

      <div v-else class="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div class="max-w-2xl">
          <h2 class="text-2xl font-semibold text-slate-900">
            Patterns Across Time
          </h2>
          <p class="mt-3 text-base leading-relaxed text-slate-600">
            MindWorks is beginning to notice what is becoming visible across your reflections:
            broad recurring structures, the conditions beforehand, and what commonly follows.
          </p>
        </div>
        <router-link
            to="/continuity"
            class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white transition hover:bg-slate-700 w-full md:w-auto shadow-lg"
        >
          See My Patterns
        </router-link>
      </div>
    </div>

    <!-- Programme Card -->

    <div
        class="relative mb-14 overflow-hidden rounded-3xl border border-slate-900 bg-slate-900 p-10 text-white shadow-2xl"
    >

      <div class="max-w-3xl">

        <h2 class="text-3xl font-semibold">
          MindWorks Visibility Path
        </h2>

        <p class="mt-4 text-lg leading-relaxed text-slate-300">
          Full access to the complete six-stage visibility path.
          The material is designed to be moved through gradually,
          but all sections become available immediately after purchase.
        </p>

        <div class="mt-8 flex flex-wrap gap-4">

          <button
              v-if="!hasProgrammeAccess"
              @click="purchaseProgramme"
              class="rounded-xl bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
          >
            Unlock Full Programme
          </button>

          <div
              v-else
              class="rounded-xl bg-emerald-500/20 px-5 py-3 text-sm font-medium text-emerald-200"
          >
            Full programme access active
          </div>

        </div>

      </div>

    </div>

    <!-- Loading -->

    <div
        v-if="entitlements.loading || courseProgress.loading"
        class="text-slate-500"
    >
      Restoring your progress...
    </div>

    <!-- Weeks -->

    <div
        v-else
        class="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
    >

      <div
          v-for="week in weeks"
          :key="week.number"
          class="rounded-2xl border bg-white p-6 shadow-sm transition duration-300 hover:shadow-md"
          :class="cardClass(week.number)"
      >

        <div class="mb-5 flex items-start justify-between">

          <div>

            <h2 class="text-xl font-semibold">
              Stage {{ week.number }}
            </h2>

            <p class="mt-1 text-sm text-slate-500">
              {{ week.title }}
            </p>

          </div>

          <div
              class="rounded-full px-3 py-1 text-xs font-medium"
              :class="statusClass(week.number)"
          >
            {{ continuityLabel(week.number) }}
          </div>

        </div>

        <p class="mb-6 text-sm leading-relaxed text-slate-600">
          {{ week.description }}
        </p>

        <div
            v-if="shouldForegroundWeek(week.number)"
            class="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800"
        >
          This appears to be the next active area of continuity.
        </div>

        <!-- Access -->

        <router-link
            v-if="hasProgrammeAccess"
            :to="`/course/${week.number}`"
            class="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm text-white transition hover:bg-slate-700"
        >
          {{ buttonLabel(week.number) }}
        </router-link>

        <!-- Locked -->

        <button
            v-else
            @click="purchaseProgramme"
            class="w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium transition hover:bg-slate-100"
        >
          Unlock Programme
        </button>

      </div>

    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"

import { courseWeeks } from "../data/courseWeeks"

import { useAuthStore } from "../stores/auth"
import { useEntitlementStore } from "../stores/entitlements"
import { useCourseProgressStore } from "../stores/courseProgress"

import { useCoursePurchases } from "../composables/useCoursePurchases"
import { useContinuity } from "../composables/useContinuity"

const auth = useAuthStore()
const entitlements =
    useEntitlementStore()

const courseProgress =
    useCourseProgressStore()

const {
  purchaseProgramme,
  hasProgrammeAccess
} = useCoursePurchases()

const {
  lastActiveWeek,
  continuityLabel,
  shouldForegroundWeek,
  isWeekCompleted,
  isWeekActive,
  nextRecommendedWeek
} = useContinuity()

const weeks = computed(() => courseWeeks)

const continuitySummary = ref("")
const summaryLoading = ref(false)

const fetchCourseOverview = async () => {
  if (!auth.user?.id) return
  
  summaryLoading.value = true
  try {
    const result = await fetch("/api/getContinuitySummary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: auth.user.id,
        isCourseOverview: true
      })
    })
    const data = await result.json()
    continuitySummary.value = data.markdown_summary || data.summary || ""
  } catch (err) {
    console.error("OVERVIEW ERROR:", err)
  } finally {
    summaryLoading.value = false
  }
}

const parsedSummary = computed(() => {
  if (!continuitySummary.value) return []
  
  // Safety mapping: convert old headings to new ones if they appear
  const cleanSummary = continuitySummary.value
    .replace(/###\s+What Keeps Reappearing[:]?/gi, "### Recurring Movement")
    .replace(/###\s+Repeated Sequence[:]?/gi, "### Recurring Movement")
    .replace(/###\s+Primary State[:]?/gi, "### Before the Shift")
    .replace(/###\s+Possible Function[:]?/gi, "### Afterwards")
    .replace(/###\s+What Remains Unclear[:]?/gi, "### Still Emerging")
    .trim()

  const sections = []
  let currentSection = null
  
  const lines = cleanSummary.split('\n')
  lines.forEach(line => {
    if (line.startsWith('### ')) {
      if (currentSection) sections.push(currentSection)
      currentSection = {
        title: line.replace('### ', '').trim(),
        content: []
      }
    } else {
      if (currentSection) {
        currentSection.content.push(line)
      } else if (line.trim()) {
        currentSection = {
          title: "",
          content: [line]
        }
      }
    }
  })
  
  if (currentSection) sections.push(currentSection)
  
  return sections.map(s => ({
    ...s,
    content: s.content.join('\n').trim()
  }))
})

onMounted(() => {
  fetchCourseOverview()
})

const statusClass = (weekNumber) => {

  if (!hasProgrammeAccess.value) {
    return "bg-slate-200 text-slate-600"
  }

  if (
      isWeekCompleted(
          weekNumber
      )
  ) {
    return "bg-emerald-100 text-emerald-700"
  }

  if (
      isWeekActive(
          weekNumber
      )
  ) {
    return "bg-amber-100 text-amber-700"
  }

  if (
      shouldForegroundWeek(
          weekNumber
      )
  ) {
    return "bg-blue-100 text-blue-700"
  }

  return "bg-slate-100 text-slate-700"

}

const buttonLabel = (weekNumber) => {

  if (
      isWeekCompleted(
          weekNumber
      )
  ) {
    return "Revisit"
  }

  if (
      isWeekActive(
          weekNumber
      )
  ) {
    return "Continue"
  }

  if (
      shouldForegroundWeek(
          weekNumber
      )
  ) {
    return "Continue Forward"
  }

  return "Open Stage"

}

const cardClass = (weekNumber) => {

  if (!hasProgrammeAccess.value) {
    return "border-slate-200"
  }

  if (
      shouldForegroundWeek(
          weekNumber
      )
  ) {
    return "border-amber-300 ring-1 ring-amber-200"
  }

  if (
      isWeekCompleted(
          weekNumber
      )
  ) {
    return "border-emerald-200"
  }

  if (
      weekNumber >
      nextRecommendedWeek.value
  ) {
    return "border-slate-100 opacity-60"
  }

  return "border-slate-200"

}
</script>script>