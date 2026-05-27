<template>
  <div class="mx-auto max-w-6xl px-6 py-16">

    <!-- Header -->

    <div class="mb-14">

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
        v-if="entitlements.loading"
        class="text-slate-500"
    >
      Loading access...
    </div>

    <!-- Weeks -->

    <div
        v-else
        class="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
    >

      <div
          v-for="week in weeks"
          :key="week.number"
          class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
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
              :class="
              hasProgrammeAccess
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-200 text-slate-600'
            "
          >
            {{ hasProgrammeAccess ? 'Unlocked' : 'Locked' }}
          </div>

        </div>

        <p class="mb-6 text-sm leading-relaxed text-slate-600">
          {{ week.description }}
        </p>

        <!-- Access -->

        <router-link
            v-if="hasProgrammeAccess"
            :to="`/course/week-${week.number}`"
            class="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm text-white transition hover:bg-slate-700"
        >
          Continue
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
import { computed, onMounted } from "vue"

import { useAuthStore } from "../stores/auth"
import { useEntitlementStore } from "../stores/entitlements"

import { useCoursePurchases } from "../composables/useCoursePurchases"

const auth = useAuthStore()

const entitlements = useEntitlementStore()

const {
  purchaseProgramme,
  hasProgrammeAccess
} = useCoursePurchases()

onMounted(async () => {

  if (auth.user) {
    await entitlements.fetchEntitlements(auth.user.id)
  }

})

const weeks = computed(() => [

  {
    number: 1,
    title: "Recognition & Fragmentation",

    description:
        "Observing continuity breakdown and attentional drift."
  },

  {
    number: 2,
    title: "Pressure & Avoidance",

    description:
        "Understanding internal pressure accumulation."
  },

  {
    number: 3,
    title: "Emotional Interruption",

    description:
        "Tracking disruption and behavioural collapse."
  },

  {
    number: 4,
    title: "Reaction & Compensation",

    description:
        "Studying automatic compensatory behaviours."
  },

  {
    number: 5,
    title: "Embodied Continuity",

    description:
        "Restoring grounded attentional contact."
  },

  {
    number: 6,
    title: "Integration",

    description:
        "Stabilising continuity and long-range observation."
  }

])
</script>