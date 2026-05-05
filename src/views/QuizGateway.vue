<template>
  <main class="min-h-screen bg-stone-50 px-6 py-24">
    <div class="max-w-2xl mx-auto space-y-10">

      <!-- Hook -->
      <header class="space-y-6">
        <h1 class="text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
          You’re not stuck because you lack discipline
        </h1>

        <p class="text-lg text-slate-700 leading-relaxed">
          Most people already know what they “should” be doing.
          The problem is that something in them resists it.
        </p>

        <p class="text-lg text-slate-700 leading-relaxed">
          This reflection maps the internal system behind that resistance —
          the parts of you that push, avoid, distract, or shut things down.
        </p>
      </header>

      <!-- Credibility -->
      <section class="bg-white border border-stone-200 rounded-xl p-6 space-y-3 text-slate-700">
        <p>• Takes around 5–10 minutes</p>
        <p>• No labels or diagnoses</p>
        <p>• Produces a structured, in-depth reflection</p>
      </section>

      <!-- CTA -->
      <div class="pt-6">
        <button
            @click="handleContinue"
            class="w-full px-6 py-4 bg-slate-900 text-white text-lg font-medium rounded-md hover:bg-slate-800 transition"
        >
          Begin reflection
        </button>
      </div>

    </div>
  </main>
</template>

<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const handleContinue = () => {
  // allow quiz access
  sessionStorage.setItem("passedGateway", "true")

  router.push("/adhd-quiz")
}
</script>