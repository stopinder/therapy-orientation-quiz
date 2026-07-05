<template>
  <section class="relative overflow-hidden bg-white px-6 pt-12 pb-12 sm:pt-16 sm:pb-16 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
        Why You Do Things You Don’t Mean To Do
      </h1>
      <p class="mt-8 text-lg font-medium text-slate-600 sm:text-xl/relaxed">
        You start something. Then something else takes over. MindWorks shows you exactly when that happens.
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-y-8 sm:flex-row sm:gap-x-12 sm:items-start">
        <div class="flex flex-col items-center gap-y-3">
          <router-link
            to="/gateway"
            class="rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-all"
          >
            Start Free Orientation
          </router-link>
          <p class="text-xs text-slate-500">
            No account required.
          </p>
        </div>

        <div class="flex flex-col items-center gap-y-3">
          <router-link
            to="/course"
            class="text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors pt-3.5"
          >
            Begin Observation Journey
          </router-link>
          <p class="text-xs text-slate-500">
            Observation through the full programme.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// LandingHero.vue
</script>
