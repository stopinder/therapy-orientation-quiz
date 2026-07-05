<template>
  <section class="bg-slate-50 px-6 py-20 sm:py-24 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Begin with one observation.
      </h2>
      <p class="mt-6 text-lg text-slate-600">
        The first step is not to change the pattern.
        <br class="hidden sm:block" />
        It is to see it clearly enough that the next step can be approached more clearly.
      </p>
      <div class="mt-10 flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:items-start">
        <div class="flex flex-col items-center gap-y-3">
          <router-link
            to="/gateway"
            class="rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all"
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
