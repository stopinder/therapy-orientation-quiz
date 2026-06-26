<template>
  <div class="min-h-screen bg-white selection:bg-slate-100">
    <main>
      <LandingHero />

      <!-- Quote 1 -->
      <section id="insight-is-not-enough" class="px-6 py-12 text-center sm:py-16 scroll-mt-24">
        <h2 class="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 mb-4">
          Insight is not enough.
        </h2>
        <div class="mx-auto max-w-2xl text-xl font-light text-slate-600 sm:text-2xl leading-snug space-y-2">
          <p>A single insight can be useful.</p>
          <p>But if the same pattern keeps returning, something more than insight may be needed.</p>
        </div>
      </section>

      <LandingProblem />

      <LandingPossible />

      <LandingVisibility />

      <LandingHowItWorks />
      <LandingOrientation />
      <LandingDifference />
      <LandingBridge />
      <LandingPhilosophy />
      <LandingCTA class="pb-32" />
    </main>

    <PublicFooter />
  </div>
</template>

<script setup>
import LandingHero from '../components/landing/LandingHero.vue'
import LandingProblem from '../components/landing/LandingProblem.vue'
import LandingPossible from '../components/landing/LandingPossible.vue'
import LandingVisibility from '../components/landing/LandingVisibility.vue'
import LandingHowItWorks from '../components/landing/LandingHowItWorks.vue'
import LandingOrientation from '../components/landing/LandingOrientation.vue'
import LandingDifference from '../components/landing/LandingDifference.vue'
import LandingBridge from '../components/landing/LandingBridge.vue'
import LandingPhilosophy from '../components/landing/LandingPhilosophy.vue'
import LandingCTA from '../components/landing/LandingCTA.vue'
import PublicFooter from '../components/PublicFooter.vue'
</script>
