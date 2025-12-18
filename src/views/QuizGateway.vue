<template>
  <main class="min-h-screen bg-stone-50 px-6 py-20">
    <div class="max-w-2xl mx-auto space-y-8">
      <h1 class="text-3xl font-semibold tracking-tight text-slate-900">
        Before you continue
      </h1>

      <p class="text-lg text-slate-700">
        This reflection is structured, clinically informed, and designed to be taken seriously.
        It is not diagnostic.
      </p>

      <ul class="list-disc pl-5 text-slate-700 space-y-2">
        <li>5–10 minutes</li>
        <li>No labels or diagnoses</li>
        <li>Written clinical-style reflection</li>
      </ul>

      <div class="pt-6">
        <router-link
            to="/adhd-quiz"
            class="inline-block rounded-md bg-slate-900 px-6 py-3 text-white font-medium hover:bg-slate-800 transition"
        >
          Continue to the quiz
        </router-link>
      </div>
    </div>
  </main>
</template>

