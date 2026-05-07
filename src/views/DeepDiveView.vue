<template>
  <main class="min-h-screen bg-stone-50 px-6 py-20">
    <div class="max-w-3xl mx-auto">

      <header class="mb-14">
        <h1 class="text-4xl font-semibold tracking-tight text-slate-900 mb-4">
          Your Reflection Report
        </h1>

        <p class="text-lg text-slate-600 leading-relaxed">
          Behavioural Patterns & Attention Profile
        </p>
      </header>

      <section
          v-if="!report.overview"
          class="bg-white border border-stone-200 rounded-2xl p-8 space-y-5"
      >
        <p class="text-slate-700">
          Enter your email to generate your full report.
        </p>

        <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-4 py-3 border border-stone-300 rounded-lg"
        />

        <button
            @click="handleSubmit"
            class="w-full px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
        >
          {{ loading ? "Generating..." : "Generate Full Report" }}
        </button>
      </section>

      <section
          v-if="report.tldr"
          class="mb-10 bg-slate-100 border border-slate-200 rounded-2xl p-8"
      >
        <h2 class="text-xl font-semibold text-slate-900 mb-4">
          TL;DR
        </h2>

        <p class="text-slate-700 leading-relaxed whitespace-pre-line">
          {{ report.tldr }}
        </p>
      </section>

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

        <div class="bg-white rounded-2xl border border-stone-200 p-8">
          <p class="whitespace-pre-line leading-relaxed text-slate-700">
            {{ report.overview }}
          </p>
        </div>
      </section>

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

        <div class="bg-white rounded-2xl border border-stone-200 p-8">
          <p class="whitespace-pre-line leading-relaxed text-slate-700">
            {{ report.functioning }}
          </p>
        </div>
      </section>

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

        <div class="bg-white rounded-2xl border border-stone-200 p-8">
          <p class="whitespace-pre-line leading-relaxed text-slate-700">
            {{ report.patterns }}
          </p>
        </div>
      </section>

      <section
          v-if="report.closing"
          class="bg-slate-900 text-white rounded-2xl p-10 mt-16"
      >
        <h2 class="text-2xl font-semibold mb-5">
          Next Step
        </h2>

        <p class="leading-relaxed text-slate-200 whitespace-pre-line mb-8">
          {{ report.closing }}
        </p>

        <div class="flex flex-col sm:flex-row gap-4">
          <button
              @click="downloadReport"
              class="px-6 py-3 bg-white text-slate-900 rounded-lg hover:bg-slate-200 transition"
          >
            Download Full Report
          </button>

          <button
              @click="goToProgramme"
              class="px-6 py-3 border border-white/30 rounded-lg hover:bg-white/10 transition"
          >
            Explore the 6-Week Programme
          </button>
        </div>
      </section>

    </div>
  </main>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { supabase } from "../lib/supabase.js"

const router = useRouter()

const email = ref("")
const loading = ref(false)

const report = ref({
  tldr: "",
  overview: "",
  functioning: "",
  patterns: "",
  closing: ""
})

const goToProgramme = () => {
  router.push("/programme")
}

const handleSubmit = async () => {
  if (!email.value) return

  loading.value = true

  try {
    if (supabase) {
      await supabase.from("email_optins").insert([
        {
          email: email.value,
          opt_in: true
        }
      ])
    }

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
  line-height: 1.7;
  color: #1e293b;
}

h1 {
  font-size: 34px;
  margin-bottom: 8px;
}

h2 {
  margin-top: 40px;
  margin-bottom: 14px;
  font-size: 24px;
}

.section {
  margin-bottom: 40px;
}

.tldr {
  background: #f1f5f9;
  padding: 24px;
  border-radius: 14px;
}

.cta {
  margin-top: 50px;
  background: #0f172a;
  color: white;
  padding: 32px;
  border-radius: 18px;
}

.button {
  display: inline-block;
  margin-top: 18px;
  background: white;
  color: #0f172a;
  padding: 12px 20px;
  border-radius: 10px;
  text-decoration: none;
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
  href="https://yourdomain.com/programme"
>
Explore the 6-Week Programme
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