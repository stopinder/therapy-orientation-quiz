<template>
  <main class="min-h-screen bg-stone-50 px-6 py-20">
    <div class="max-w-3xl mx-auto space-y-12">

      <!-- Header -->
      <header class="space-y-6">
        <h1 class="text-3xl font-semibold tracking-tight text-slate-900">
          A structured process for working with your internal system
        </h1>

        <p class="text-lg text-slate-700 leading-relaxed">
          The reflection you’ve just completed identifies patterns.
          This programme is designed to help you work with those patterns in a more direct and sustained way.
        </p>
      </header>

      <!-- Problem -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-slate-900">
          Why insight alone doesn’t lead to change
        </h2>

        <p class="text-slate-700 leading-relaxed">
          Most people already have some awareness of their habits, reactions, and internal conflicts.
          Despite this, the same patterns tend to repeat.
        </p>

        <p class="text-slate-700 leading-relaxed">
          This is usually because these patterns are not random.
          They are organised, protective, and often operate automatically.
        </p>

        <p class="text-slate-700 leading-relaxed">
          Working with them requires more than observation.
          It requires a consistent way of engaging with them.
        </p>
      </section>

      <!-- What this is -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-slate-900">
          What this programme is
        </h2>

        <p class="text-slate-700 leading-relaxed">
          This is a structured, self-guided process for understanding and working with your internal system.
        </p>

        <ul class="list-disc pl-5 text-slate-700 space-y-2">
          <li>Mapping patterns of attention, avoidance, and control</li>
          <li>Working with protective responses rather than overriding them</li>
          <li>Developing greater internal stability and clarity</li>
          <li>Applying this understanding in everyday situations</li>
        </ul>
      </section>

      <!-- Structure -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-slate-900">
          Structure
        </h2>

        <ul class="list-disc pl-5 text-slate-700 space-y-2">
          <li>5-week guided process</li>
          <li>Short, focused sessions each week</li>
          <li>Somatic attention exercises</li>
          <li>Written reflections and structured prompts</li>
        </ul>
      </section>

      <!-- Who it's for -->
      <section class="space-y-4">
        <h2 class="text-xl font-semibold text-slate-900">
          Who this is for
        </h2>

        <p class="text-slate-700 leading-relaxed">
          This is intended for people who recognise the patterns described in the reflection
          and are willing to engage with them in a more deliberate way.
        </p>

        <p class="text-slate-700 leading-relaxed">
          It is not a substitute for therapy, but it may complement existing work
          or serve as a structured starting point.
        </p>
      </section>

      <!-- CTA -->
      <section class="pt-6 border-t border-stone-200 space-y-4">
        <p class="text-slate-800 font-medium">
          If you want to work with these patterns more directly:
        </p>

        <button
            @click="handleJoin"
            class="px-6 py-3 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition"
        >
          Join the programme
        </button>

        <p class="text-xs text-slate-500">
          Further details and access instructions will be provided after joining.
        </p>
      </section>

    </div>
  </main>
</template>

<script setup>
const handleJoin = () => {
  // Placeholder for now
  // Later: connect to payment or email onboarding flow
  alert("Next step: connect this to your course delivery or email onboarding.")
}
</script>