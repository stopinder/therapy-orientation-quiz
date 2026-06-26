<template>
  <section class="bg-slate-50 px-6 py-20 sm:py-24 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Start with a Free Orientation
      </h2>
      <div class="mt-6 space-y-4 text-lg text-slate-600 leading-relaxed">
        <p>
          Begin with a short guided orientation.
        </p>
        <p>
          There are no scores. There are no labels.
        </p>
        <p>
          You will only be asked for your email before receiving your personalised report.
        </p>
      </div>
      <div class="mt-10 flex flex-col items-center gap-4">
        <router-link
          to="/gateway"
          class="rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all"
        >
          Start Free Orientation
        </router-link>
        <p class="text-sm text-slate-500">
          Takes only a few minutes.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
// LandingOrientation.vue
</script>
