<template>
  <div class="mx-auto max-w-xl px-6 py-24 text-center">

    <div class="rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">

      <h1 class="mb-4 text-3xl font-semibold text-slate-900">
        Continue the Observation Journey
      </h1>

      <div class="mb-8 space-y-4 leading-relaxed text-slate-600">
        <p>
          Your account is ready, but the full six-stage programme requires course access.
        </p>
        <p>
          You can begin with the Free Orientation, or continue to unlock the full Observation Journey.
        </p>
      </div>

      <div class="flex flex-col items-center gap-4">
        <router-link
            to="/adhd-quiz"
            class="w-full max-w-xs rounded-xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-700"
        >
          Start Free Orientation
        </router-link>

        <button
            @click="purchaseProgramme"
            class="w-full max-w-xs rounded-xl border border-slate-300 px-6 py-3 text-slate-700 transition hover:bg-slate-50"
        >
          Unlock Full Programme
        </button>

        <router-link
            to="/"
            class="mt-4 text-sm text-slate-500 hover:text-slate-800"
        >
          Return Home
        </router-link>
      </div>

    </div>

  </div>
</template>

<script setup>
import { useCoursePurchases } from "../composables/useCoursePurchases"

const { purchaseProgramme } = useCoursePurchases()
</script>
