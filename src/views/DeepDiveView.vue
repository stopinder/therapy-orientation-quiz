<template>
  <main class="min-h-screen bg-stone-50 px-6 py-20">
    <div class="max-w-3xl mx-auto">

      <!-- Header -->
      <header class="mb-14">
        <h1 class="text-4xl font-semibold tracking-tight text-slate-900 mb-4">
          Your Reflection Report
        </h1>

        <p class="text-lg text-slate-600 leading-relaxed">
          Behavioural Patterns & Attention Profile
        </p>
      </header>

      <!-- Email Capture -->
      <section
          v-if="!report.overview"
          class="bg-white border border-stone-200 rounded-2xl p-8 space-y-5 shadow-sm"
      >
        <p class="text-slate-700">
          Enter your email to generate your full report.
        </p>

        <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
        />

        <button
            @click="handleSubmit"
            class="w-full px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
        >
          {{ loading ? "Generating..." : "Generate Full Report" }}
        </button>

        <p class="text-xs text-slate-500">
          Your email may be used to send occasional updates related to MindWorks.
        </p>
      </section>
      <pre>{{ report }}</pre>
      <!-- TLDR -->
      <section
          v-if="report.tldr"
          class="mb-10 bg-slate-100 border border-slate-200 rounded-2xl p-8"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-slate-900">
            TL;DR
          </h2>

          <button
              @click="downloadReport"
              class="text-sm px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-200 transition"
          >
            Download Full Report
          </button>
        </div>

        <p class="text-slate-700 leading-relaxed whitespace-pre-line">
          {{ report.tldr }}
        </p>
      </section>

      <!-- Section 1 -->
      <section
          v-if="report.overview"
          class="mb-12"
      >
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-2xl font-semibold text-slate-900">
            1. Behavioural Patterns
          </h2>

          <button
              @click="downloadReport"
              class="text-sm px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition"
          >
            Download Full Report
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <p class="whitespace-pre-line leading-relaxed text-slate-700">
            {{ report.overview }}
          </p>
        </div>
      </section>

      <!-- Section 2 -->
      <section
          v-if="report.functioning"
          class="mb-12"
      >
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-2xl font-semibold text-slate-900">
            2. Daily Functioning
          </h2>

          <button
              @click="downloadReport"
              class="text-sm px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition"
          >
            Download Full Report
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <p class="whitespace-pre-line leading-relaxed text-slate-700">
            {{ report.functioning }}
          </p>
        </div>
      </section>

      <!-- Section 3 -->
      <section
          v-if="report.patterns"
          class="mb-12"
      >
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-2xl font-semibold text-slate-900">
            3. Patterns & Trade-Offs
          </h2>

          <button
              @click="downloadReport"
              class="text-sm px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition"
          >
            Download Full Report
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <p class="whitespace-pre-line leading-relaxed text-slate-700">
            {{ report.patterns }}
          </p>
        </div>
      </section>

      <!-- CTA -->
      <section
          v-if="report.closing"
          class="bg-slate-900 text-white rounded-3xl p-10 mt-16 shadow-xl"
      >
        <h2 class="text-3xl font-semibold mb-6">
          Next Step
        </h2>

        <p class="leading-relaxed text-slate-200 whitespace-pre-line mb-8">
          {{ report.closing }}
        </p>

        <div class="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h3 class="text-xl font-medium mb-4">
            MindWorks 6-Week Programme
          </h3>

          <p class="text-slate-300 leading-relaxed mb-6">
            A structured behavioural programme focused on sustained attention,
            interruption patterns, behavioural continuity, and repeated re-entry
            into tasks.

            This is not based around motivation hacks or productivity systems.
            The focus is on understanding and gradually interrupting the cycle
            while it is actively happening.
          </p>

          <div class="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p class="text-2xl font-semibold">
                $29.99
              </p>

              <p class="text-sm text-slate-400">
                One-time payment
              </p>
            </div>

            <a
                href="https://gpttherapyassist.lemonsqueezy.com/checkout"
                class="lemonsqueezy-button px-6 py-3 bg-white text-slate-900 rounded-xl hover:bg-slate-200 transition inline-flex items-center justify-center font-medium"
            >
              Begin the Programme
            </a>
          </div>
        </div>

        <button
            @click="downloadReport"
            class="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10 transition"
        >
          Download Full Report
        </button>
      </section>

    </div>
  </main>
</template>

<script setup>
import { ref } from "vue"
// import { supabase } from "../lib/supabase.js"

const email = ref("")
const loading = ref(false)

const report = ref({
  tldr: "",
  overview: "",
  functioning: "",
  patterns: "",
  closing: ""
})

const handleSubmit = async () => {
  if (!email.value) return

  loading.value = true

  try {
    // if (supabase) {
//   await supabase.from("email_optins").insert([
//     {
//       email: email.value,
//       opt_in: true
//     }
//   ])
// }

    const storedProfile =
        sessionStorage.getItem("quizProfile")

    const profile =
        storedProfile
            ? JSON.parse(storedProfile)
            : {}

    const response = await fetch(
        "/api/expand-report-v2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ profile })
        }
    )

    const data = await response.json()

    report.value = data

  } finally {
    loading.value = false
  }
}

const downloadReport = () => {
  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Reflection Report</title>

<style>
body {
  font-family: Arial, sans-serif;
  max-width: 760px;
  margin: 40px auto;
  padding: 32px;
  line-height: 1.8;
  color: #1e293b;
  background: #fafaf9;
}

h1 {
  font-size: 36px;
  margin-bottom: 8px;
}

h2 {
  margin-top: 40px;
  margin-bottom: 14px;
  font-size: 24px;
}

.section {
  margin-bottom: 48px;
  background: white;
  padding: 28px;
  border-radius: 16px;
  border: 1px solid #e7e5e4;
}

.tldr {
  background: #f1f5f9;
  padding: 28px;
  border-radius: 16px;
  margin-bottom: 48px;
}

.cta {
  margin-top: 60px;
  background: #0f172a;
  color: white;
  padding: 36px;
  border-radius: 22px;
}

.button {
  display: inline-block;
  margin-top: 18px;
  background: white;
  color: #0f172a;
  padding: 12px 22px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
}
</style>
</head>

<body>

<h1>Your Reflection Report</h1>

<p>
Behavioural Patterns & Attention Profile
</p>

<div class="tldr">
<h2>TL;DR</h2>
<p>${report.value.tldr}</p>
</div>

<div class="section">
<h2>1. Behavioural Patterns</h2>
<p>${report.value.overview}</p>
</div>

<div class="section">
<h2>2. Daily Functioning</h2>
<p>${report.value.functioning}</p>
</div>

<div class="section">
<h2>3. Patterns & Trade-Offs</h2>
<p>${report.value.patterns}</p>
</div>

<div class="cta">
<h2>Next Step</h2>

<p>${report.value.closing}</p>

<a
  class="button"
  href="https://gpttherapyassist.lemonsqueezy.com/buy/230d911f-446a-490f-94ab-509fae996c4f"
>
  Begin the 6-Week Programme — $29.99
</a>
</div>

</body>
</html>
`

  const blob = new Blob(
      [html],
      { type: "text/html;charset=utf-8" }
  )

  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")

  link.href = url
  link.download = "reflection-report.html"

  link.click()

  URL.revokeObjectURL(url)
}
</script>