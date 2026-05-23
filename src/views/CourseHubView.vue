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

    <!-- Full Programme Card -->

    <div
        class="relative mb-14 overflow-hidden rounded-3xl border border-slate-900 bg-slate-900 p-10 text-white shadow-2xl"
    >

      <div
          class="absolute right-6 top-6 rounded-full bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-wide"
      >
        Recommended
      </div>

      <div class="max-w-3xl">

        <h2 class="text-3xl font-semibold">
          {{ products.fullProgramme.title }}
        </h2>

        <p class="mt-4 text-lg leading-relaxed text-slate-300">
          {{ products.fullProgramme.description }}
        </p>

        <div class="mt-8 flex items-end gap-3">

          <div class="text-5xl font-semibold">
            €{{ products.fullProgramme.price }}
          </div>

          <div class="pb-1 text-slate-400">
            full access
          </div>

        </div>

        <div class="mt-8 flex flex-wrap gap-4">

          <button
              class="rounded-xl bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
          >
            Unlock Full Programme
          </button>

          <div
              class="flex items-center text-sm text-slate-400"
          >
            Immediate access to all six weeks
          </div>

        </div>

      </div>

    </div>

    <!-- Weeks -->

    <div
        v-if="entitlements.loading"
        class="text-slate-500"
    >
      Loading access...
    </div>

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

        <!-- Unlocked -->

        <router-link
            v-if="week.unlocked"
            :to="`/course/week-${week.number}`"
            class="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm text-white transition hover:bg-slate-700"
        >
          Continue
        </router-link>

        <!-- Sequentially Available -->

        <div
            v-else-if="week.canPurchase"
            class="space-y-3"
        >

          <button
              class="w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium transition hover:bg-slate-100"
          >
            Unlock Week {{ week.number }} —
            €{{ week.price }}
          </button>

          <button
              class="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm text-white transition hover:bg-slate-700"
          >
            Unlock Full Programme —
            €{{ products.fullProgramme.price }}
          </button>

        </div>

        <!-- Locked By Sequence -->

        <div
            v-else
            class="rounded-xl bg-slate-100 p-4 text-sm leading-relaxed text-slate-500"
        >
          Complete the previous week before unlocking this stage.
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from "vue"

import { useAuthStore } from "../stores/auth"
import { useEntitlementStore } from "../stores/entitlements"

import { COURSE_PRODUCTS } from "../config/courseProducts"

const auth = useAuthStore()

const entitlements = useEntitlementStore()

const products = COURSE_PRODUCTS

onMounted(async () => {

  if (auth.user) {
    await entitlements.fetchEntitlements(auth.user.id)
  }

})

const canPurchaseWeek = (weekNumber) => {

  if (weekNumber === 1) {
    return true
  }

  return entitlements.canAccessWeek(weekNumber - 1)

}

const weeks = computed(() => [

  {
    number: 1,
    title: "Recognition & Fragmentation",
    description:
        "Observing continuity breakdown and attentional drift.",

    unlocked: entitlements.canAccessWeek(1),

    canPurchase: canPurchaseWeek(1),

    price: products.weekly[1].price
  },

  {
    number: 2,
    title: "Pressure & Avoidance",
    description:
        "Understanding internal pressure accumulation.",

    unlocked: entitlements.canAccessWeek(2),

    canPurchase: canPurchaseWeek(2),

    price: products.weekly[2].price
  },

  {
    number: 3,
    title: "Emotional Interruption",
    description:
        "Tracking disruption and behavioural collapse.",

    unlocked: entitlements.canAccessWeek(3),

    canPurchase: canPurchaseWeek(3),

    price: products.weekly[3].price
  },

  {
    number: 4,
    title: "Reaction & Compensation",
    description:
        "Studying automatic compensatory behaviours.",

    unlocked: entitlements.canAccessWeek(4),

    canPurchase: canPurchaseWeek(4),

    price: products.weekly[4].price
  },

  {
    number: 5,
    title: "Embodied Continuity",
    description:
        "Restoring grounded attentional contact.",

    unlocked: entitlements.canAccessWeek(5),

    canPurchase: canPurchaseWeek(5),

    price: products.weekly[5].price
  },

  {
    number: 6,
    title: "Integration",
    description:
        "Stabilising continuity and long-range observation.",

    unlocked: entitlements.canAccessWeek(6),

    canPurchase: canPurchaseWeek(6),

    price: products.weekly[6].price
  }

])
</script>