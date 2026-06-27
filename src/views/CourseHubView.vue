<template>
  <div class="mx-auto max-w-6xl px-6 py-16">

    <!-- Header -->

    <div class="mb-14">

      <div
          v-if="hasProgrammeAccess"
          class="mb-6 flex items-center gap-4"
      >
        <div class="inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-600 border border-emerald-100">
          Full programme access active
        </div>
        <div
            v-if="lastActiveWeek"
            class="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600"
        >
          Last active: Stage {{ lastActiveWeek }}
        </div>
      </div>

      <div class="flex items-center justify-between">
        <h1 class="text-4xl font-semibold tracking-tight">
          Your Visibility Path
        </h1>

        <router-link
            v-if="hasProgrammeAccess"
            to="/continuity"
            class="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
        >
          View Continuity
        </router-link>
      </div>

      <p class="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
        A six-stage path for recognising interruptions, sequences, recurring
        patterns, internal states, consequences, and connected responses over time.
      </p>

    </div>

    <!-- Programme Card (only shown if not paid) -->

    <div
        v-if="!hasProgrammeAccess"
        class="relative mb-14 overflow-hidden rounded-3xl border border-slate-900 bg-slate-900 p-10 text-white shadow-2xl"
    >

      <div class="max-w-3xl">

        <h2 class="text-3xl font-semibold">
          Unlock the Observation Journey
        </h2>

        <p class="mt-4 text-lg leading-relaxed text-slate-300">
          The material is designed to be moved through gradually.
          All six stages become available immediately after purchase.
        </p>

        <div class="mt-8 flex flex-wrap gap-4">

          <button
              @click="purchaseProgramme"
              class="rounded-xl bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
          >
            Unlock Full Programme
          </button>

        </div>

      </div>

    </div>

    <!-- Patterns Across Time / Continuity Entry -->

    <div
        v-if="hasProgrammeAccess"
        class="mb-14 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div v-if="summaryLoading" class="flex flex-col items-center justify-center py-12 text-center">
        <Transition
            mode="out-in"
            enter-active-class="transition duration-500 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-500 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
          <p :key="currentSummaryLoadingMessage" class="text-lg font-medium text-slate-900 animate-pulse">
            {{ currentSummaryLoadingMessage }}
          </p>
        </Transition>
      </div>

      <div v-else-if="continuitySummary">
        <h2 class="mb-6 text-2xl font-semibold text-slate-900">
          Becoming visible
        </h2>
        
        <div class="space-y-8">
          <div 
            v-for="(section, idx) in parsedSummary" 
            :key="idx"
          >
            <h4 v-if="section.title && !['What is becoming visible', 'Becoming visible'].includes(section.title)" class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {{ section.title }}
            </h4>
            <div 
              v-if="['What is becoming visible', 'Becoming visible'].includes(section.title) || !section.title" 
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
            View Full Continuity
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
            recurring structures, the conditions beforehand, and what follows.
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
              v-if="hasProgrammeAccess"
              class="rounded-full px-3 py-1 text-xs font-medium"
              :class="statusClass(week.number)"
          >
            {{ continuityLabel(week.number) }}
          </div>

          <!-- Padlock (only if not paid) -->
          <div
              v-else
              class="text-slate-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>

        </div>

        <p class="mb-6 text-sm leading-relaxed text-slate-600">
          {{ week.description }}
        </p>

        <div
            v-if="shouldForegroundWeek(week.number) && hasProgrammeAccess"
            class="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800"
        >
          This appears to be the next area of continuity.
        </div>

        <!-- Access -->

        <div v-if="hasProgrammeAccess">
          <router-link
              :to="`/course/${week.number}`"
              class="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm text-white transition hover:bg-slate-700"
          >
            {{ buttonLabel(week.number) }}
          </router-link>
        </div>

        <!-- Unavailable/Upcoming (only shown if not paid) -->

        <div
            v-else
            class="flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50/50 px-5 py-3 text-sm text-slate-400"
        >
          Stage {{ week.number }}
        </div>

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

const summaryLoadingMessages = [
  "Reviewing your recent observations...",
  "Looking for what is relevant to this stage...",
  "Placing observations beside one another...",
  "Preparing what is becoming visible..."
]

const currentSummaryLoadingMessage = ref(summaryLoadingMessages[0])
let summaryLoadingInterval = null

const startSummaryLoadingRotation = () => {
  let index = 0
  currentSummaryLoadingMessage.value = summaryLoadingMessages[0]
  summaryLoadingInterval = setInterval(() => {
    index = (index + 1) % summaryLoadingMessages.length
    currentSummaryLoadingMessage.value = summaryLoadingMessages[index]
  }, 1500)
}

const stopSummaryLoadingRotation = () => {
  if (summaryLoadingInterval) {
    clearInterval(summaryLoadingInterval)
    summaryLoadingInterval = null
  }
}

const fetchCourseOverview = async () => {
  if (!auth.user?.id) return
  
  summaryLoading.value = true
  startSummaryLoadingRotation()
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    const result = await fetch("/api/getContinuitySummary", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
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
    stopSummaryLoadingRotation()
  }
}

const parsedSummary = computed(() => {
  if (!continuitySummary.value) return []
  
  // Safety mapping: convert old headings to new ones if they appear
  const cleanSummary = continuitySummary.value.trim()
  
  const mapping = {
    'What Keeps Reappearing': 'Recurring Movement',
    'Repeated Sequence': 'Recurring Movement',
    'Primary State': 'Before the Shift',
    'Possible Function': 'Afterwards',
    'What Remains Unclear': 'Still Emerging'
  }

  const sectionsMap = new Map()
  const lines = cleanSummary.split('\n')
  let currentSectionTitle = null
  
  lines.forEach(line => {
    if (line.startsWith('### ')) {
      let rawTitle = line.replace('### ', '').trim().replace(/[:]$/, '')
      currentSectionTitle = mapping[rawTitle] || rawTitle
      
      if (!sectionsMap.has(currentSectionTitle)) {
        sectionsMap.set(currentSectionTitle, [])
      }
    } else {
      if (currentSectionTitle !== null) {
        sectionsMap.get(currentSectionTitle).push(line)
      } else if (line.trim()) {
        currentSectionTitle = ""
        sectionsMap.set(currentSectionTitle, [line])
      }
    }
  })
  
  const sections = []
  sectionsMap.forEach((content, title) => {
    sections.push({
      title,
      content: content.join('\n').trim()
    })
  })
  
  return sections
})

onMounted(() => {
  fetchCourseOverview()
})

const statusClass = (weekNumber) => {

  if (!hasProgrammeAccess.value) {
    return "bg-slate-50 text-slate-400"
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