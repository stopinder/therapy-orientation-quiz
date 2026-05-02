<template>
  <main class="min-h-screen bg-stone-50 px-6 py-20">
    <div class="max-w-2xl mx-auto space-y-10">

      <!-- Header -->
      <header class="space-y-4">
        <h1 class="text-3xl font-semibold tracking-tight text-slate-900">
          A more detailed view of your internal system
        </h1>

        <p class="text-lg text-slate-700">
          The initial reflection highlights surface-level patterns.
          This step expands on how those patterns operate, interact, and maintain themselves over time.
        </p>
      </header>

      <!-- Email Capture -->
      <section class="space-y-4 border border-stone-200 rounded-xl p-6 bg-white">
        <p class="text-sm text-slate-700">
          Enter your email to generate your full breakdown.
        </p>

        <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-4 py-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
        />

        <button
            @click="handleSubmit"
            class="w-full px-4 py-3 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition"
        >
          {{ loading ? "Generating…" : "Generate full breakdown" }}
        </button>

        <p class="text-xs text-slate-500">
          Your email is used to send your reflection and occasional updates about MindWorks.
          You can unsubscribe at any time.
        </p>
      </section>

      <!-- Expanded Report -->
      <section v-if="expandedText" class="space-y-6">

        <div class="border-t pt-6"></div>

        <div v-html="formattedText"></div>

        <!-- Closing Bridge -->
        <div class="mt-10 p-6 bg-stone-100 border border-stone-200 rounded-xl">
          <p class="text-slate-800 font-medium mb-2">
            Understanding is only the first step
            <div class="pt-6">
              <button
                  @click="goToProgramme"
                  class="px-6 py-3 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition"
              >
                Work with this in a structured way
              </button>
            </div>
          </p>

          <p class="text-sm text-slate-700">
            These patterns tend to persist because they are protective.
            Shifting them usually requires a more structured process of working with them directly,
            rather than simply observing them.
          </p>
        </div>

      </section>

    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../lib/supabase.js"

const router = useRouter()

const goToProgramme = () => {
  router.push("/programme")
}
const email = ref("")
const loading = ref(false)
const expandedText = ref("")

const handleSubmit = async () => {
  if (!email.value) return

  loading.value = true

  try {
    // Save email
    if (supabase) {
      await supabase.from("email_optins").insert([
        { email: email.value, opt_in: true }
      ])
    }

    // Get previous scores from session
    const storedProfile = sessionStorage.getItem("quizProfile")
    const profile = storedProfile ? JSON.parse(storedProfile) : {}

    // Call API
    const response = await fetch("/api/expand-report-v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mode: "deep",
        profile
      })
    })

    const data = await response.json()
    expandedText.value = data.text || ""

  } finally {
    loading.value = false
  }
}

const formattedText = computed(() => {
  if (!expandedText.value) return ""

  const lines = expandedText.value.replace(/\r/g, "").split("\n")
  let html = ""

  for (const line of lines) {
    if (/^\s*\*\*(.+?)\*\*\s*$/.test(line)) {
      const title = line.replace(/\*\*/g, "")
      html += `<h3 class="mt-8 mb-3 text-lg font-semibold text-slate-800">${title}</h3>`
      continue
    }

    if (!line.trim()) continue

    html += `<p class="mb-4 text-slate-700 leading-relaxed">${line}</p>`
  }

  return html
})
</script>