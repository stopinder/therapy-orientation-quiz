<template>
  <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 px-6 pt-10 pb-24">
    <div class="max-w-3xl mx-auto px-4 md:px-6 pt-8 space-y-16">

      <!-- INTRO -->
      <section class="max-w-2xl space-y-6">
        <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">
          MindWorks
        </p>
        <h1 class="text-3xl md:text-[2.45rem] font-medium tracking-[-0.025em] text-slate-900 leading-[1.12]">
          Recognising patterns across time.
        </h1>
        <div class="space-y-4 text-[1.02rem] leading-[1.8] text-slate-700">
          <p>
            Many people understand themselves intellectually, yet still return to familiar reactions and situations. Insight matters, but it often fades when pressure returns.
          </p>
          <p>
            MindWorks helps observations accumulate, so recurring patterns become easier to recognise as they happen.
          </p>
        </div>
      </section>

      <!-- WHAT MINDWORKS DOES -->
      <section class="content-section">
        <div class="space-y-3">
          <p class="section-label">What MindWorks Does</p>
          <h2 class="section-title">Observation before explanation.</h2>
        </div>
        <div class="body-copy">
          <p>
            MindWorks is a guided environment for noticing interruptions, states, and recurring responses. After years of working as a psychotherapist, I saw that people often knew what was happening but lacked a way to track it in real moments.
          </p>
          <p>
            The emphasis is recognition. We begin by asking simple questions: What happened? What came just before? What was already there? This builds enough visibility to approach the next step with clarity.
          </p>
        </div>
      </section>

      <!-- WHO THIS IS FOR -->
      <section class="content-section">
        <div class="space-y-3">
          <p class="section-label">Who this is for</p>
          <h2 class="section-title">For people who keep meeting the same pattern.</h2>
        </div>
        <ul class="space-y-2 pl-5 text-[1rem] leading-[1.7] text-slate-700 list-disc">
          <li>People who repeat the same patterns</li>
          <li>People who understand but still react</li>
          <li>People who lose clarity under pressure</li>
          <li>People who want clarity without labels</li>
        </ul>
      </section>

      <!-- PROGRAMME -->
      <section class="rounded-2xl border border-slate-200/80 bg-white/60 px-7 py-8 max-w-2xl">
        <div class="space-y-3">
          <p class="section-label">The Programme</p>
          <h2 class="section-title !text-[1.7rem] md:!text-[2rem]">Structured continuation.</h2>
        </div>
        <div class="body-copy pt-2">
          <p>A guided path through six stages of observation:</p>
          <ul class="mt-4 space-y-2 text-sm text-slate-700">
            <li class="flex gap-3"><span class="font-semibold min-w-[70px]">Stage 1</span> Observation — a single moment becomes visible.</li>
            <li class="flex gap-3"><span class="font-semibold min-w-[70px]">Stage 2</span> Sequence — the order of events.</li>
            <li class="flex gap-3"><span class="font-semibold min-w-[70px]">Stage 3</span> Pattern — what keeps appearing.</li>
            <li class="flex gap-3"><span class="font-semibold min-w-[70px]">Stage 4</span> State — the conditions already present.</li>
            <li class="flex gap-3"><span class="font-semibold min-w-[70px]">Stage 5</span> Results — the consequences of the response.</li>
            <li class="flex gap-3"><span class="font-semibold min-w-[70px]">Stage 6</span> Relation — how responses gather around pressure.</li>
          </ul>
        </div>
      </section>

      <!-- CREATOR -->
      <section class="max-w-2xl rounded-2xl border border-slate-200 bg-slate-100/70 px-7 py-8">
        <div class="space-y-3">
          <p class="section-label">Creator</p>
          <h2 class="section-title !text-[1.7rem] md:!text-[2rem]">Robert Ormiston</h2>
        </div>
        <div class="body-copy pt-2">
          <p>
            Robert is a psychotherapist (BACP) with 25 years of experience in mental health. His work focuses on how recurring patterns become clearer through long-term observation.
          </p>
          <div class="pt-2">
            <a href="https://therapyworks.works" target="_blank" rel="noopener" class="inline-flex items-center text-sm font-medium text-slate-900 hover:text-slate-700 transition underline underline-offset-4">
              TherapyWorks
            </a>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="flex flex-wrap gap-3 pt-4">
        <router-link
            to="/course"
            class="inline-flex items-center rounded-xl border border-slate-900 bg-slate-900 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Begin
        </router-link>
        <router-link
            to="/gateway"
            class="inline-flex items-center rounded-xl border border-slate-300 px-6 py-3.5 text-sm text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
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
// About page — static content only
</script>

<style scoped>

.content-section {
  @apply max-w-2xl space-y-5;
}

.section-label {
  @apply text-[11px] uppercase tracking-[0.24em] text-slate-500;
}

.section-title {
  @apply text-[1.9rem] md:text-[2.3rem] font-medium tracking-[-0.025em] leading-[1.16] text-slate-900;
}

.body-copy {
  @apply space-y-4 text-[1.02rem] leading-[1.9] text-slate-700;
}

.programme-row {
  @apply rounded-xl border border-slate-200/80 bg-stone-50/70 px-4 py-3;
}

.programme-row span {
  @apply block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500;
}

.programme-row p {
  @apply mt-1 leading-relaxed text-slate-700;
}

.faq-item {
  @apply border-b border-slate-200 py-4;
}

.faq-item summary {
  @apply cursor-pointer text-[1rem] font-medium text-slate-700;
}

.faq-item p {
  @apply mt-3 text-[0.98rem] leading-[1.85] text-slate-600;
}

.footer-link {
  @apply underline underline-offset-2 transition hover:text-slate-800;
}

</style>