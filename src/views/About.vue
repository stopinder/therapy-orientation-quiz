<template>
  <main class="min-h-screen bg-stone-50 px-6 pt-10 pb-24 font-sans antialiased">
    <div class="max-w-[650px] mx-auto space-y-12 md:space-y-14">

      <!-- HERO SECTION -->
      <section class="space-y-5">
        <div class="space-y-4">
          <h1 class="hero-headline">
            You understand what’s happening.<br />
            And yet, you still find yourself doing the same thing again.
          </h1>
          
          <div class="hero-subtext">
            <p>
              You mean to follow through—then something shifts.<br />
              You plan to respond differently—then react in a familiar way.
            </p>
            <p class="font-medium text-slate-900">
              This is where MindWorks begins.
            </p>
          </div>
        </div>

        <div class="pt-2">
          <router-link
              to="/gateway"
              class="cta-button"
          >
            Start Free Orientation
          </router-link>
        </div>
      </section>

      <!-- WHAT MINDWORKS DOES -->
      <section class="section-container">
        <h2 class="section-heading">What MindWorks Does</h2>
        <div class="body-copy">
          <p>
            Most approaches focus on insight.
          </p>
          <p>
            You understand what’s happening.<br />
            You can explain it.<br />
            And still, the same reaction appears again.
          </p>
          <p>
            MindWorks does something different.
          </p>
          <p>
            It shows you what actually happens across real moments.
          </p>
          <p>
            Not what you remember.<br />
            Not what you think.<br />
            What actually happens.
          </p>
          <p>
            Across situations, a pattern begins to appear.
          </p>
          <p>
            You start something.<br />
            Then something shifts.
          </p>
          <p>
            Not once.<br />
            Again and again.
          </p>
          <p>
            That is where clarity begins.
          </p>
        </div>
      </section>

      <!-- WHO THIS IS FOR -->
      <section class="section-container">
        <div class="space-y-4">
          <h2 class="section-heading">Who This Is For</h2>
          <p class="body-copy !mb-0">For people who recognise this:</p>
        </div>
        <div class="body-copy">
          <ul class="list-disc pl-5 space-y-2 text-slate-600">
            <li>You understand what’s happening, but still do it</li>
            <li>You notice the pattern after it’s already happened</li>
            <li>You lose clarity in the moment, especially under pressure</li>
            <li>You tell yourself it will be different next time—and it isn’t</li>
          </ul>
          <p class="pt-2">
            This is not about fixing it immediately.
          </p>
          <p>
            It’s for seeing it clearly enough that something different becomes possible.
          </p>
        </div>
        
        <div class="pt-2">
          <router-link
              to="/gateway"
              class="cta-button"
          >
            Start Free Orientation
          </router-link>
        </div>
      </section>

      <!-- PROGRAMME -->
      <section class="section-container rounded-2xl border border-slate-200 bg-white/50 p-7 shadow-sm">
        <h2 class="section-heading">The Programme</h2>
        <div class="body-copy">
          <p>A guided path through six stages of observation:</p>
          <ul class="mt-4 space-y-2 text-[15px] text-slate-600">
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
      <section class="section-container rounded-2xl border border-slate-200 bg-slate-100/50 p-7">
        <h2 class="section-heading">Creator</h2>
        <div class="body-copy">
          <p class="text-[1.1rem] font-medium text-slate-900 !mb-1">Robert Ormiston</p>
          <p>
            Robert is a psychotherapist (BACP) with 25 years of experience in mental health. His work focuses on how recurring patterns become clearer through long-term observation.
          </p>
          <div class="pt-2">
            <a href="https://therapyworks.works" target="_blank" rel="noopener" class="text-[15px] font-medium text-slate-900 hover:text-slate-700 transition underline underline-offset-4">
              TherapyWorks
            </a>
          </div>
        </div>
      </section>

      <!-- FINAL CTA -->
      <section class="pt-4">
        <router-link
            to="/course"
            class="cta-button"
        >
          Begin
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

.hero-headline {
  @apply text-[28px] md:text-[32px] font-medium tracking-tight text-slate-900 leading-[1.3];
}

.hero-subtext {
  @apply space-y-4 text-[17px] md:text-[18px] text-slate-600 leading-[1.6];
}

.section-container {
  @apply space-y-4;
}

.section-heading {
  @apply text-[21px] md:text-[23px] font-semibold tracking-tight text-slate-900;
}

.body-copy {
  @apply space-y-3 text-[16px] md:text-[17px] font-normal leading-[1.6] text-slate-600;
}

.body-copy p {
  @apply mb-3;
}

.body-copy p:last-child {
  @apply mb-0;
}

.cta-button {
  @apply inline-flex items-center rounded-xl bg-slate-900 px-8 py-4 text-base font-medium text-white transition hover:bg-slate-800 shadow-sm;
}

</style>