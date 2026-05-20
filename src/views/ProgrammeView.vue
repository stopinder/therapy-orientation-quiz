<template>
  <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 px-6 pt-10 pb-20">
    <div class="max-w-4xl mx-auto space-y-24">

      <!-- HERO -->
      <section class="pt-10 space-y-6 max-w-3xl">
        <p class="text-sm uppercase tracking-[0.24em] text-slate-500">
          Six-Week Guided Programme
        </p>

        <h1 class="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-slate-900">
          A structured reflection on attention, fragmentation,
          emotional avoidance, and continuity.
        </h1>

        <p class="text-lg md:text-xl leading-relaxed text-slate-700 max-w-2xl">
          Structured weekly practices combining psychological reflection,
          embodied attention, and grounded self-observation.
        </p>

        <div class="flex flex-wrap gap-3 pt-4">
          <button
              class="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Join the programme
          </button>

          <button
              class="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
          >
            Preview Week One
          </button>
        </div>
      </section>

      <!-- THE PROBLEM -->
      <section class="max-w-3xl space-y-6">
        <div class="space-y-3">
          <p class="section-label">
            The pattern
          </p>

          <h2 class="section-title">
            You may understand yourself afterwards,
            but lose contact in the moment.
          </h2>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="problem-card">
            <p>
              Starting with clarity and losing continuity halfway through.
            </p>
          </div>

          <div class="problem-card">
            <p>
              Disappearing into reactions before recognising what happened.
            </p>
          </div>

          <div class="problem-card">
            <p>
              Feeling capable in theory, but inconsistent in practice.
            </p>
          </div>

          <div class="problem-card">
            <p>
              Repeating cycles of momentum, collapse, frustration, and recovery.
            </p>
          </div>

          <div class="problem-card">
            <p>
              Losing awareness of the body during pressure, conflict, or overwhelm.
            </p>
          </div>

          <div class="problem-card">
            <p>
              Recognising patterns intellectually while still being pulled by them emotionally.
            </p>
          </div>
        </div>
      </section>

      <!-- STRUCTURE -->
      <section class="space-y-8">
        <div class="space-y-3 max-w-3xl">
          <p class="section-label">
            Weekly structure
          </p>

          <h2 class="section-title">
            A gradual movement from recognition
            toward continuity.
          </h2>
        </div>

        <div class="grid gap-4">
          <div
              v-for="week in weeks"
              :key="week.title"
              class="week-card"
          >
            <div class="week-number">
              {{ week.week }}
            </div>

            <div class="space-y-2">
              <h3 class="text-xl font-semibold text-slate-900">
                {{ week.title }}
              </h3>

              <p class="text-slate-600 leading-relaxed">
                {{ week.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- METHOD -->
      <section class="max-w-3xl space-y-6">
        <div class="space-y-3">
          <p class="section-label">
            The method
          </p>

          <h2 class="section-title">
            Practical self-observation rather than self-improvement performance.
          </h2>
        </div>

        <div class="space-y-5 text-slate-700 leading-relaxed text-lg">
          <p>
            The programme combines psychological reflection with embodied attention practices:
            learning to remain partially connected to bodily sensation while observing emotional,
            relational, and behavioural patterns.
          </p>

          <p>
            Each week includes preparation exercises, body sensing practices,
            reflective prompts, and practical integration into ordinary daily life.
          </p>

          <p>
            The emphasis is not on analysing yourself endlessly,
            but on recognising when awareness narrows, disappears,
            or becomes organised around automatic reactions.
          </p>
        </div>
      </section>

      <!-- WHO IT'S FOR -->
      <section class="max-w-3xl space-y-6">
        <div class="space-y-3">
          <p class="section-label">
            Who this is for
          </p>

          <h2 class="section-title">
            Reflective people who are tired of simplistic explanations.
          </h2>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="audience-card">
            Emotionally intelligent people who still feel internally divided.
          </div>

          <div class="audience-card">
            Professionals carrying chronic cognitive and emotional load.
          </div>

          <div class="audience-card">
            People who overthink afterwards but disappear in the moment.
          </div>

          <div class="audience-card">
            Inconsistent but capable people who want greater continuity.
          </div>

          <div class="audience-card">
            People seeking grounded reflection rather than diagnosis or hype.
          </div>

          <div class="audience-card">
            Those wanting practical psychological work without performance culture.
          </div>
        </div>
      </section>

      <!-- FINAL CTA -->
      <section class="rounded-3xl border border-slate-200 bg-white/70 px-8 py-12 text-center shadow-sm">
        <div class="max-w-2xl mx-auto space-y-6">
          <p class="text-lg text-slate-700 leading-relaxed">
            You do not need to arrive certain.
            Recognition is enough to begin.
          </p>

          <div class="flex justify-center gap-3 flex-wrap">
            <button
                class="rounded-full bg-slate-900 px-7 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Join the programme
            </button>

            <button
                class="rounded-full border border-slate-300 px-7 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
            >
              Read the reflection first
            </button>
          </div>

          <p class="text-sm text-slate-500 pt-2">
            Full checkout and guided access coming shortly.
          </p>
        </div>
      </section>

    </div>
  </main>
</template>

<script setup>
const weeks = [
  {
    week: "Week 1",
    title: "Interrupting Automaticity",
    description:
        "Recognising how quickly awareness collapses into mechanical functioning and emotional reaction."
  },
  {
    week: "Week 2",
    title: "Attention & Fragmentation",
    description:
        "Observing contradiction, divided intention, and the instability of sustained attention."
  },
  {
    week: "Week 3",
    title: "Protective Organisation",
    description:
        "Understanding how emotional avoidance and protective patterns shape behaviour."
  },
  {
    week: "Week 4",
    title: "Relationship & Self-Contact",
    description:
        "Noticing how relational pressure alters attention, presence, and emotional stability."
  },
  {
    week: "Week 5",
    title: "Embodied Stability",
    description:
        "Developing greater grounding through body sensing and ordinary-life awareness practices."
  },
  {
    week: "Week 6",
    title: "Continuity",
    description:
        "Moving toward a more stable relationship with attention, emotion, and everyday functioning."
  }
]
</script>

<style scoped>
.section-label {
  @apply text-sm uppercase tracking-[0.22em] text-slate-500;
}

.section-title {
  @apply text-3xl md:text-4xl font-semibold tracking-tight leading-tight text-slate-900;
}

.problem-card {
  @apply rounded-2xl border border-slate-200 bg-white/70 p-5 text-slate-700 leading-relaxed shadow-sm;
}

.week-card {
  @apply flex flex-col md:flex-row gap-5 rounded-2xl border border-slate-200 bg-white/75 px-6 py-6 shadow-sm;
}

.week-number {
  @apply text-sm uppercase tracking-[0.22em] text-slate-500 min-w-[90px] pt-1;
}

.audience-card {
  @apply rounded-2xl border border-slate-200 bg-white/70 p-5 text-slate-700 leading-relaxed shadow-sm;
}
</style>