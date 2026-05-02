<template>
  <main class="min-h-screen bg-stone-50 px-6 py-20">
    <div class="max-w-2xl mx-auto space-y-8">

      <h1 class="text-3xl font-semibold tracking-tight text-slate-900">
        You’re not stuck because you lack discipline
      </h1>

      <p class="text-lg text-slate-700">
        Most people already know what they “should” be doing.
        The problem is something in them resists it.
      </p>

      <p class="text-lg text-slate-700">
        This reflection maps the internal system behind that resistance —
        the parts of you that push, avoid, distract, or shut things down.
      </p>

      <div class="bg-white border border-slate-200 rounded-md p-5 space-y-2 text-slate-700">
        <p>• Takes around 5–10 minutes</p>
        <p>• No labels or diagnoses</p>
        <p>• Produces a structured, in-depth personal report</p>
      </div>

      <p class="text-sm text-slate-500">
        This is not therapy or a diagnosis. It’s a structured reflection tool designed to help you understand how your internal system operates.
      </p>

      <div class="pt-6">
        <button
            @click="handleContinue"
            class="inline-block rounded-md bg-slate-900 px-6 py-3 text-white font-medium hover:bg-slate-800 transition"
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
  sessionStorage.setItem("passedGateway", "true")
  router.push("/adhd-quiz")
}
</script>
