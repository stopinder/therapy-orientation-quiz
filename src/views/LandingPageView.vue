<template>
  <div class="min-h-screen bg-white selection:bg-slate-100">
    <main class="mx-auto">
      <LandingHero />
      <LandingCTA show-support />
      <LandingProblem />
      <LandingHowItWorks />
      <LandingDiscovery />
      <LandingCTA class="pb-24" />
    </main>

    <PublicFooter />
  </div>
</template>

<script setup>
import LandingHero from '../components/landing/LandingHero.vue'
import LandingCTA from '../components/landing/LandingCTA.vue'
import LandingProblem from '../components/landing/LandingProblem.vue'
import LandingHowItWorks from '../components/landing/LandingHowItWorks.vue'
import LandingDiscovery from '../components/landing/LandingDiscovery.vue'
import PublicFooter from '../components/PublicFooter.vue'
</script>
