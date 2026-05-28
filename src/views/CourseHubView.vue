<template>
  <div class="mx-auto max-w-6xl px-6 py-16">

    <!-- Header -->

    <div class="mb-14">

      <div
          v-if="hasProgrammeAccess && lastActiveWeek"
          class="mb-6 inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600"
      >
        Last active: Week {{ lastActiveWeek }}
      </div>

      <h1 class="text-4xl font-semibold tracking-tight">
        Your Programme
      </h1>

      <p class="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
        A structured six-week process exploring continuity,
        fragmentation, emotional interruption, and grounded
        behavioural observation.
      </p>

    </div>

    <!-- Programme Card -->

    <div
        class="relative mb-14 overflow-hidden rounded-3xl border border-slate-900 bg-slate-900 p-10 text-white shadow-2xl"
    >

      <div class="max-w-3xl">

        <h2 class="text-3xl font-semibold">
          MindWorks Programme
        </h2>

        <p class="mt-4 text-lg leading-relaxed text-slate-300">
          Full access to the complete six-week programme.
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
              Week {{ week.number }}
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
            :to="`/course/week-${week.number}`"
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
import { computed } from "vue"

import { courseWeeks } from "../data/courseWeeks"

import { useEntitlementStore } from "../stores/entitlements"
import { useCourseProgressStore } from "../stores/courseProgress"

import { useCoursePurchases } from "../composables/useCoursePurchases"
import { useContinuity } from "../composables/useContinuity"

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

  return "Open Week"

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