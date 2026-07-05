<template>
  <div class="min-h-screen bg-white selection:bg-slate-100">
    <main class="max-w-4xl mx-auto">
      <LandingHero />
      <LandingCTA />
      <LandingProblem />
      <LandingCTA class="pb-10" />
    </main>

    <PublicFooter />
  </div>
</template>

<script setup>
import LandingHero from '../components/landing/LandingHero.vue'
import LandingCTA from '../components/landing/LandingCTA.vue'
import LandingProblem from '../components/landing/LandingProblem.vue'
import PublicFooter from '../components/PublicFooter.vue'
</script>
