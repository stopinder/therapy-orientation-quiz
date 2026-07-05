<template>
  <main class="min-h-screen bg-stone-50 pt-10 pb-24 font-sans antialiased">
    <div class="max-w-2xl mx-auto px-4 mt-10">

      <!-- HERO SECTION -->
      <section class="mt-10">
        <div class="mb-4">
          <h1 class="text-3xl md:text-4xl font-medium mb-4">
            You understand what’s happening.<br />
            And yet, you still find yourself doing the same thing again.
          </h1>
          
          <div class="text-base md:text-lg">
            <p class="mb-3">
              You mean to follow through—then something shifts.<br />
              You plan to respond differently—then react in a familiar way.
            </p>
            <p class="font-medium text-slate-900 mb-3">
              This is where MindWorks begins.
            </p>
          </div>
        </div>

        <div class="mt-6">
          <router-link
              to="/gateway"
              class="inline-flex items-center rounded-xl bg-slate-900 px-8 py-4 text-base font-medium text-white transition hover:bg-slate-800 shadow-sm"
          >
            Start Free Orientation
          </router-link>
        </div>
      </section>

      <!-- WHAT MINDWORKS DOES -->
      <section class="mt-10">
        <h2 class="text-xl md:text-2xl font-medium mb-4">What MindWorks Does</h2>
        <div class="text-base md:text-lg">
          <p class="mb-3">
            Most approaches focus on insight.
          </p>
          <p class="mb-3">
            You understand what’s happening.<br />
            You can explain it.<br />
            And still, the same reaction appears again.
          </p>
          <p class="mb-3">
            MindWorks does something different.
          </p>
          <p class="mb-3">
            It shows you what actually happens across real moments.
          </p>
          <p class="mb-3">
            Not what you remember.<br />
            Not what you think.<br />
            What actually happens.
          </p>
          <p class="mb-3">
            Across situations, a pattern begins to appear.
          </p>
          <p class="mb-3">
            You start something.<br />
            Then something shifts.
          </p>
          <p class="mb-3">
            Not once.<br />
            Again and again.
          </p>
          <p class="mb-3">
            That is where clarity begins.
          </p>
        </div>
      </section>

      <!-- WHO THIS IS FOR -->
      <section class="mt-10">
        <div class="mb-4">
          <h2 class="text-xl md:text-2xl font-medium mb-4">Who This Is For</h2>
          <p class="text-base md:text-lg mb-3">For people who recognise this:</p>
        </div>
        <div class="text-base md:text-lg">
          <ul class="list-disc pl-5 mb-3 text-gray-600">
            <li class="mb-1">You understand what’s happening, but still do it</li>
            <li class="mb-1">You notice the pattern after it’s already happened</li>
            <li class="mb-1">You lose clarity in the moment, especially under pressure</li>
            <li class="mb-1">You tell yourself it will be different next time—and it isn’t</li>
          </ul>
          <p class="mb-3">
            This is not about fixing it immediately.
          </p>
          <p class="mb-3">
            It’s for seeing it clearly enough that something different becomes possible.
          </p>
        </div>
        
        <div class="mt-6">
          <router-link
              to="/gateway"
              class="inline-flex items-center rounded-xl bg-slate-900 px-8 py-4 text-base font-medium text-white transition hover:bg-slate-800 shadow-sm"
          >
            Start Free Orientation
          </router-link>
        </div>
      </section>

      <!-- PROGRAMME -->
      <section class="mt-10 rounded-2xl border border-slate-200 bg-white/50 p-7 shadow-sm">
        <h2 class="text-xl md:text-2xl font-medium mb-4">The Programme</h2>
        <div class="text-base md:text-lg">
          <p class="mb-3">A guided path through six stages of observation:</p>
          <ul class="mt-4 space-y-2 text-sm text-gray-600">
            <li class="flex gap-3"><span class="font-semibold text-slate-800 min-w-[65px]">Stage 1</span> Observation — a single moment becomes visible.</li>
            <li class="flex gap-3"><span class="font-semibold text-slate-800 min-w-[65px]">Stage 2</span> Sequence — the order of events.</li>
            <li class="flex gap-3"><span class="font-semibold text-slate-800 min-w-[65px]">Stage 3</span> Pattern — what keeps appearing.</li>
            <li class="flex gap-3"><span class="font-semibold text-slate-800 min-w-[65px]">Stage 4</span> State — the conditions already present.</li>
            <li class="flex gap-3"><span class="font-semibold text-slate-800 min-w-[65px]">Stage 5</span> Results — the consequences of the response.</li>
            <li class="flex gap-3"><span class="font-semibold text-slate-800 min-w-[65px]">Stage 6</span> Relation — how responses gather around pressure.</li>
          </ul>
        </div>
      </section>

      <!-- CREATOR -->
      <section class="mt-10 rounded-2xl border border-slate-200 bg-slate-100/50 p-7">
        <h2 class="text-xl md:text-2xl font-medium mb-4">Creator</h2>
        <div class="text-base md:text-lg">
          <p class="font-medium text-slate-900 mb-1">Robert Ormiston</p>
          <p class="mb-3">
            Robert is a psychotherapist (BACP) with 25 years of experience in mental health. His work focuses on how recurring patterns become clearer through long-term observation.
          </p>
          <div class="mt-4">
            <a href="https://therapyworks.works" target="_blank" rel="noopener" class="text-sm font-medium text-slate-900 hover:text-slate-700 transition underline underline-offset-4">
              TherapyWorks
            </a>
          </div>
        </div>
      </section>

      <!-- FINAL CTA -->
      <section class="mt-10">
        <router-link
            to="/gateway"
            class="inline-flex items-center rounded-xl bg-slate-900 px-8 py-4 text-base font-medium text-white transition hover:bg-slate-800 shadow-sm"
        >
          Start Free Orientation
        </router-link>
      </section>

    </div>

    <PublicFooter />
  </main>
</template>

<script setup>
import PublicFooter from '../components/PublicFooter.vue'
</script>

<style scoped>
/* Scoped styles removed in favor of global utility classes */
</style>