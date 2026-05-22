<template>
  <div class="mx-auto max-w-4xl px-6 py-16">

    <div class="mb-10">

      <router-link
          to="/course"
          class="mb-6 inline-flex text-sm text-slate-500 hover:text-slate-800"
      >
        ← Back to Course
      </router-link>

      <h1 class="text-4xl font-semibold tracking-tight">
        Week {{ weekNumber }}
      </h1>

      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
        Placeholder lesson content.
      </p>

    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">

      <p class="leading-relaxed text-slate-700">
        This is where your real course content will eventually live.
      </p>

    </div>

  </div>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

const weekNumber = computed(() => route.params.weekNumber)
</script>