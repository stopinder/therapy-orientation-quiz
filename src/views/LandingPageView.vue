<template>
  <div class="min-h-screen bg-white selection:bg-slate-100">
    <main>
      <LandingHero />
      <LandingCTA class="pb-32" />
    </main>

    <PublicFooter />
  </div>
</template>

<script setup>
import LandingHero from '../components/landing/LandingHero.vue'
import LandingCTA from '../components/landing/LandingCTA.vue'
import PublicFooter from '../components/PublicFooter.vue'
</script>
