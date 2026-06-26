<template>
  <div class="min-h-screen bg-white selection:bg-slate-100">
    <main>
      <LandingHero />

      <!-- Quote 1 -->
      <div class="px-6 py-16 text-center sm:py-24">
        <p class="mx-auto max-w-2xl text-2xl font-light italic text-slate-400 sm:text-3xl leading-snug">
          "One reflection tells a story. Many reflections reveal a pattern."
        </p>
      </div>

      <LandingProblem />

      <!-- Quote 2 -->
      <div class="px-6 py-16 text-center sm:py-24">
        <p class="mx-auto max-w-2xl text-2xl font-light italic text-slate-400 sm:text-3xl leading-snug">
          "Don't collect insights. Collect observations."
        </p>
      </div>

      <LandingVisibility />

      <!-- Quote 3 -->
      <div class="px-6 py-20 text-center sm:py-28 bg-slate-50">
        <p class="mx-auto max-w-3xl text-3xl font-light italic text-slate-400 sm:text-5xl leading-tight">
          "The important question isn't 'Why did this happen?' It's 'What keeps happening?'"
        </p>
      </div>

      <LandingHowItWorks />

      <LandingDifference />

      <LandingCTA />
    </main>

    <LandingFooter />
  </div>
</template>

<script setup>
import LandingHero from '../components/landing/LandingHero.vue'
import LandingProblem from '../components/landing/LandingProblem.vue'
import LandingVisibility from '../components/landing/LandingVisibility.vue'
import LandingHowItWorks from '../components/landing/LandingHowItWorks.vue'
import LandingDifference from '../components/landing/LandingDifference.vue'
import LandingCTA from '../components/landing/LandingCTA.vue'
import LandingFooter from '../components/landing/LandingFooter.vue'
</script>
