<template>
  <main class="max-w-3xl mx-auto px-6 py-20 space-y-24">

    <!-- Hero -->
    <section class="space-y-6">
      <h1 class="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
        A structured psychological reflection — built to be taken seriously
      </h1>

      <p class="text-lg leading-relaxed text-slate-700 max-w-2xl">
        MindWorks offers structured, psychology-informed reflection tools designed
        to help people make sense of patterns in attention, emotion, and behaviour
        before jumping to conclusions.
      </p>

      <router-link
          to="/adhd-quiz"
          class="inline-block mt-4 rounded-md bg-slate-900 px-6 py-3 text-white font-medium hover:bg-slate-800 transition"
      >
        Take the quiz
      </router-link>
    </section>

    <!-- Spacer / placeholder image block -->
    <section class="h-56 w-full rounded-lg bg-gradient-to-br from-slate-200 to-slate-300"></section>

    <!-- Framing -->
    <section class="space-y-4">
      <p class="text-base leading-relaxed text-slate-700 max-w-2xl">
        This reflection is designed to sit in the space between curiosity and
        conclusion — after you begin noticing patterns, but before labels are
        applied.
      </p>
    </section>

    <!-- How it works -->
    <section class="space-y-6">
      <h2 class="text-xl font-semibold text-slate-900">
        How it works
      </h2>

      <ol class="space-y-4 list-decimal list-inside text-slate-700 max-w-2xl">
        <li>Answer a short set of carefully designed questions.</li>
        <li>Receive a written psychological reflection based on your responses.</li>
        <li>Decide for yourself what, if anything, you want to explore next.</li>
      </ol>
    </section>

    <!-- Differentiation -->
    <section class="space-y-6 rounded-lg bg-slate-50 p-8">
      <h2 class="text-xl font-semibold text-slate-900">
        Not a pop quiz
      </h2>

      <p class="text-slate-700 max-w-2xl">
        MindWorks reflections are deliberately constructed using established
        psychological frameworks, including DSM descriptive criteria and
        NICE guideline-informed thresholds.
      </p>

      <p class="text-slate-700 max-w-2xl">
        These sources are translated into reflective questions that capture
        patterns over time and lived experience, rather than checklist-style
        traits.
      </p>

      <p class="text-slate-700 max-w-2xl">
        The aim is clarity and usefulness — not diagnosis.
      </p>
    </section>

    <!-- Boundary + authority -->
    <section class="space-y-4">
      <p class="text-sm leading-relaxed text-slate-600 max-w-2xl">
        This tool is not diagnostic and does not replace professional assessment
        or medical care. It was developed by a UK-trained psychotherapist working
        at the intersection of clinical practice and digital mental-health design.
      </p>
    </section>

    <!-- Final CTA -->
    <section>
      <router-link
          to="/adhd-quiz"
          class="inline-block rounded-md bg-slate-900 px-6 py-3 text-white font-medium hover:bg-slate-800 transition"
      >
        Take the quiz
      </router-link>
    </section>

  </main>
</template>



