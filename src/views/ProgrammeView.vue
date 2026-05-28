<template>
  <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 px-6 pt-10 pb-24">
    <div class="max-w-4xl mx-auto space-y-24">

      <!-- HERO -->

      <section class="pt-8 max-w-3xl space-y-5">

        <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">
          Six-Week Guided Programme
        </p>

        <h1 class="text-3xl md:text-[2.6rem] font-medium tracking-[-0.02em] leading-[1.12] text-slate-900">
          A structured reflection on attention, fragmentation,
          emotional avoidance, and continuity.
        </h1>

        <div class="space-y-4 text-[1.03rem] leading-[1.85] text-slate-700 max-w-2xl">

          <p>
            Structured weekly practices combining psychological reflection,
            embodied attention, and grounded self-observation.
          </p>

          <p>
            This is not a productivity system or self-improvement programme.
            It is an attempt to understand how continuity repeatedly breaks down,
            particularly under emotional pressure, fragmentation, and overload.
          </p>

        </div>

        <div class="flex flex-wrap gap-3 pt-2">

          <button
              @click="enterProgramme"
              class="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
          >
            Enter Full Programme
          </button>

          <router-link
              to="/adhd-quiz"
              class="inline-flex items-center rounded-xl px-5 py-3 text-sm text-slate-600 transition hover:text-slate-900"
          >
            Begin Free Orientation Reflection
          </router-link>

        </div>

      </section>

      <!-- THE PATTERN -->

      <section class="max-w-3xl space-y-8">

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
              Recognising patterns intellectually while still being emotionally organised by them.
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
            toward greater continuity.
          </h2>

        </div>

        <div class="grid gap-3">

          <div
              v-for="week in weeks"
              :key="week.title"
              class="week-card"
          >

            <div class="week-number">
              {{ week.week }}
            </div>

            <div class="space-y-2">

              <h3 class="text-[1.08rem] font-medium text-slate-900">
                {{ week.title }}
              </h3>

              <p class="text-[0.98rem] leading-[1.8] text-slate-600">
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

        <div class="body-copy">

          <p>
            The programme combines psychological reflection with embodied attention practices:
            learning to remain partially connected to bodily sensation while observing emotional,
            relational, and behavioural patterns.
          </p>

          <p>
            Each week includes preparation exercises, body sensing practices,
            reflective prompts, and ordinary-life integration exercises.
          </p>

          <p>
            The emphasis is not on analysing yourself endlessly,
            but on recognising when awareness narrows, disappears,
            or becomes organised around automatic reactions.
          </p>

        </div>

      </section>

      <!-- WHO THIS IS FOR -->

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
            Inconsistent but capable people wanting greater continuity.
          </div>

          <div class="audience-card">
            People seeking grounded reflection rather than diagnosis or hype.
          </div>

          <div class="audience-card">
            Those wanting practical psychological work without performance culture.
          </div>

        </div>

      </section>

      <!-- WHAT CHANGES -->

      <section class="max-w-3xl space-y-6">

        <div class="space-y-3">

          <p class="section-label">
            What changes
          </p>

          <h2 class="section-title">
            Not transformation.
            Greater recognition.
          </h2>

        </div>

        <div class="body-copy">

          <p>
            Over time, many people begin recognising interruption earlier:
            the moment attention narrows,
            the body disappears,
            emotion takes over,
            or continuity starts collapsing.
          </p>

          <p>
            The aim is not permanent control.
            It is increased contact with yourself while functioning in ordinary life.
          </p>

          <p>
            For many people, that alone changes the quality of everyday experience substantially.
          </p>

        </div>

      </section>

      <!-- CTA -->

      <section class="rounded-2xl border border-slate-200 bg-white/60 px-8 py-10">

        <div class="max-w-2xl mx-auto text-center space-y-6">

          <p class="text-[1.02rem] leading-[1.85] text-slate-700">
            You do not need certainty before beginning.
            Recognition is enough.
          </p>

          <div class="flex justify-center flex-wrap gap-3">

            <button
                @click="enterProgramme"
                class="inline-flex items-center rounded-xl border border-slate-300 px-6 py-3 text-sm text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
            >
              Enter Full Programme
            </button>

            <router-link
                to="/adhd-quiz"
                class="inline-flex items-center rounded-xl px-6 py-3 text-sm text-slate-600 transition hover:text-slate-900"
            >
              Begin Free Orientation Reflection
            </router-link>

          </div>

        </div>

      </section>

    </div>
  </main>
</template>

<script setup>
const enterProgramme = () => {

  window.location.href =
      import.meta.env.VITE_LEMON_CHECKOUT_URL

}

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
  @apply text-[11px] uppercase tracking-[0.24em] text-slate-500;
}

.section-title {
  @apply text-[1.9rem] md:text-[2.35rem] font-medium tracking-[-0.02em] leading-[1.18] text-slate-900;
}

.body-copy {
  @apply space-y-4 text-[1.02rem] leading-[1.85] text-slate-700;
}

.problem-card {
  @apply rounded-2xl border border-slate-200 bg-white/60 p-5 text-[0.98rem] leading-[1.8] text-slate-700;
}

.week-card {
  @apply flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/60 px-6 py-6 transition hover:border-slate-300 md:flex-row;
}

.week-number {
  @apply min-w-[90px] pt-1 text-[10px] uppercase tracking-[0.24em] text-slate-500;
}

.audience-card {
  @apply rounded-2xl border border-slate-200 bg-white/60 p-5 text-[0.98rem] leading-[1.8] text-slate-700;
}
</style>