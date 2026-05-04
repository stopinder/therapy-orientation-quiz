=<template>
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

      <!-- Email Capture -->
      <div class="space-y-3">
        <input
            v-model="email"
            type="email"
            placeholder="Enter your email to begin"
            class="w-full px-4 py-3 border border-stone-300 rounded-md text-slate-900"
        />

        <p class="text-xs text-slate-500">
          We’ll use this to send your results and occasional MindWorks updates. You can unsubscribe at any time.
        </p>
      </div>

      <!-- Error -->
      <p v-if="error" class="text-sm text-red-500">
        Please enter a valid email
      </p>

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
import { ref } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../lib/supabase.js"

const router = useRouter()

const email = ref("")
const error = ref(false)

const handleContinue = async () => {
  // basic validation
  if (!email.value || !email.value.includes("@")) {
    error.value = true
    return
  }

  error.value = false

  // store locally
  sessionStorage.setItem("userEmail", email.value)

  // save to Supabase
  if (supabase) {
    await supabase.from("emails").insert([
      { email: email.value }
    ])
  }

  // allow quiz access
  sessionStorage.setItem("passedGateway", "true")

  router.push("/adhd-quiz")
}
</script>