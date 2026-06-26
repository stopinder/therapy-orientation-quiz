<template>
  <div class="min-h-screen bg-white selection:bg-slate-100">
    <main>
      <LandingHero />

      <!-- Quote 1 -->
      <div class="px-6 py-16 text-center sm:py-24">
        <h2 class="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 mb-4">
          Insight is not enough.
        </h2>
        <p class="mx-auto max-w-2xl text-xl font-light text-slate-600 sm:text-2xl leading-snug">
          A single insight can be useful. But if the same pattern keeps returning, something more than insight may be needed.
        </p>
      </div>

      <LandingProblem />

      <LandingPossible />

      <LandingVisibility />

      <LandingHowItWorks />

      <LandingDifference />

      <LandingBridge />

      <LandingCTA />
    </main>

    <LandingFooter />
  </div>
</template>

<script setup>
import LandingHero from '../components/landing/LandingHero.vue'
import LandingProblem from '../components/landing/LandingProblem.vue'
import LandingPossible from '../components/landing/LandingPossible.vue'
import LandingVisibility from '../components/landing/LandingVisibility.vue'
import LandingHowItWorks from '../components/landing/LandingHowItWorks.vue'
import LandingDifference from '../components/landing/LandingDifference.vue'
import LandingBridge from '../components/landing/LandingBridge.vue'
import LandingCTA from '../components/landing/LandingCTA.vue'
import LandingFooter from '../components/landing/LandingFooter.vue'
</script>
