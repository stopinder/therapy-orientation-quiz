<template>
  <main class="min-h-screen bg-stone-50 text-slate-900">
    <div class="max-w-3xl mx-auto px-6 pt-16 pb-24 space-y-16">

      <!-- HERO -->
      <section class="space-y-5">
        <h1 class="text-3xl md:text-4xl font-semibold tracking-tight">
          A structured psychological reflection — built to be taken seriously
        </h1>

        <p class="text-lg leading-relaxed text-slate-700 max-w-2xl">
          If you’ve been noticing patterns in your attention, focus, or emotional
          regulation and want a grounded way to think about them, this reflection
          offers a place to pause before drawing conclusions.
        </p>

        <router-link
            to="/gateway"
            class="inline-block rounded-md bg-slate-800 px-6 py-3 text-white font-medium hover:bg-slate-700 transition"
        >
          Take the quiz
        </router-link>
      </section>

      <!-- WHY THIS EXISTS -->
      <section class="space-y-4 max-w-2xl">
        <h2 class="text-xl font-semibold">Why this exists</h2>

        <p>There’s a lot of noise around ADHD.</p>

        <p>
          Some people arrive already convinced. Others feel unsure, dismissed, or
          overwhelmed by conflicting information. Many simply sense that
          <em>something isn’t quite working</em>.
        </p>

        <p>
          MindWorks is designed to sit in that in-between space — after curiosity
          begins, but before labels are applied.
        </p>

        <p class="font-medium">The aim is clarity, not certainty.</p>
      </section>

      <!-- WHO THIS IS FOR -->
      <section class="space-y-5 max-w-2xl">
        <h2 class="text-xl font-semibold">Who this is for</h2>

        <ul class="space-y-3 list-disc pl-5 text-slate-700">
          <li>You’re wondering whether ongoing difficulties are worth taking seriously</li>
          <li>You notice patterns over time, not just isolated bad days</li>
          <li>You want psychological grounding without being pushed toward an identity</li>
          <li>You’re looking for something closer to clinical thinking than social media</li>
        </ul>

        <p class="text-slate-700">
          You don’t need to be sure of anything to begin.
          <br />
          Uncertainty is a valid starting point here.
        </p>
      </section>

      <!-- WHO THIS IS NOT FOR -->
      <section class="space-y-5 max-w-2xl">
        <h2 class="text-xl font-semibold">Who this may not be for</h2>

        <ul class="space-y-3 list-disc pl-5 text-slate-700">
          <li>A quick diagnosis or definitive answer</li>
          <li>Confirmation of an identity you’ve already adopted</li>
          <li>A personality quiz or entertainment</li>
          <li>Medical advice or treatment recommendations</li>
        </ul>

        <p class="text-slate-700">
          That isn’t what this is designed to provide.
        </p>
      </section>

      <!-- HOW IT WORKS -->
      <section class="space-y-5 max-w-2xl">
        <h2 class="text-xl font-semibold">How it works</h2>

        <ol class="space-y-4 list-decimal pl-5 text-slate-700">
          <li>
            <strong>Answer a short set of questions.</strong>
            These focus on lived experience and patterns over time.
          </li>
          <li>
            <strong>Receive a written reflection.</strong>
            Structured like a psychologically informed summary.
          </li>
          <li>
            <strong>Decide what to do next.</strong>
            Keep it, reflect, or take it into a professional conversation.
          </li>
        </ol>

        <p class="text-slate-700">There is no obligation to go further.</p>
      </section>

      <!-- NOT A POP QUIZ -->
      <section class="rounded-lg bg-slate-100/70 px-8 py-8 space-y-5">
        <h2 class="text-xl font-semibold">Not a pop quiz</h2>

        <p class="max-w-2xl text-slate-700">
          MindWorks reflections are deliberately constructed.
        </p>

        <ul class="space-y-2 list-disc pl-5 max-w-2xl text-slate-700">
          <li>DSM descriptive domains (used reflectively, not diagnostically)</li>
          <li>NICE guideline framing (UK context)</li>
          <li>Research on attention and executive function</li>
          <li>Clinical experience of real-world presentation</li>
        </ul>

        <p class="max-w-2xl text-slate-700">
          These sources are translated, not copied. The emphasis is on patterns,
          context, and coherence.
        </p>

        <p class="font-medium max-w-2xl">
          The aim is usefulness, not classification.
        </p>
      </section>

      <!-- BOUNDARIES -->
      <section class="space-y-3 max-w-2xl">
        <h2 class="text-xl font-semibold">A note on boundaries</h2>

        <p class="text-slate-700 text-sm leading-relaxed">
          This reflection is not diagnostic and does not replace professional
          assessment or medical care. It was developed with care to balance
          rigour, restraint, and accessibility.
        </p>
      </section>

      <!-- FINAL CTA -->
      <section class="pt-4">
        <router-link
            to="/gateway"
            class="inline-block rounded-md bg-slate-800 px-6 py-3 text-white font-medium hover:bg-slate-700 transition"
        >
          Take the quiz
        </router-link>
      </section>

    </div>
  </main>
</template>
