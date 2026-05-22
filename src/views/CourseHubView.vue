<template>
  <div class="mx-auto max-w-5xl px-6 py-16">

    <div class="mb-12">

      <h1 class="text-4xl font-semibold tracking-tight">
        Your Course
      </h1>

      <p class="mt-3 max-w-2xl text-lg leading-relaxed text-slate-600">
        Structured weekly reflection and behavioural continuity work.
      </p>

    </div>

    <div
        v-if="entitlements.loading"
        class="text-slate-500"
    >
      Loading access...
    </div>

    <div
        v-else
        class="grid gap-5 md:grid-cols-2"
    >

      <div
          v-for="week in weeks"
          :key="week.number"
          class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >

        <div class="mb-4 flex items-center justify-between">

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
              week.unlocked
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-200 text-slate-600'
            "
          >
            {{ week.unlocked ? "Unlocked" : "Locked" }}
          </div>

        </div>

        <p class="mb-6 text-sm leading-relaxed text-slate-600">
          {{ week.description }}
        </p>

        <router-link
            v-if="week.unlocked"
            :to="`/course/week-${week.number}`"
            class="inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm text-white transition hover:bg-slate-700"
        >
          Enter Week
        </router-link>

        <button
            v-else
            class="inline-flex rounded-xl border border-slate-300 px-5 py-3 text-sm transition hover:bg-slate-100"
        >
          Unlock Week
        </button>

      </div>

    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from "vue"

import { useAuthStore } from "../stores/auth"
import { useEntitlementStore } from "../stores/entitlements"

const auth = useAuthStore()
const entitlements = useEntitlementStore()

onMounted(async () => {

  if (auth.user) {
    await entitlements.fetchEntitlements(auth.user.id)
  }

})

const weeks = computed(() => [

  {
    number: 1,
    title: "Recognition & Fragmentation",
    description: "Observing continuity breakdown and attentional drift.",
    unlocked: entitlements.canAccessWeek(1)
  },

  {
    number: 2,
    title: "Pressure & Avoidance",
    description: "Understanding internal pressure accumulation.",
    unlocked: entitlements.canAccessWeek(2)
  },

  {
    number: 3,
    title: "Emotional Interruption",
    description: "Tracking disruption and behavioural collapse.",
    unlocked: entitlements.canAccessWeek(3)
  },

  {
    number: 4,
    title: "Reaction & Compensation",
    description: "Studying automatic compensatory behaviours.",
    unlocked: entitlements.canAccessWeek(4)
  },

  {
    number: 5,
    title: "Embodied Continuity",
    description: "Restoring grounded attentional contact.",
    unlocked: entitlements.canAccessWeek(5)
  },

  {
    number: 6,
    title: "Integration",
    description: "Stabilising continuity and long-range observation.",
    unlocked: entitlements.canAccessWeek(6)
  }

])
</script>