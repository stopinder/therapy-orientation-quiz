<template>
  <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 px-6 py-20">

    <div class="max-w-3xl mx-auto space-y-16">

      <!-- HEADER -->
      <header class="space-y-5 max-w-2xl">

        <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">
          Reflection Report
        </p>

        <h1 class="text-3xl md:text-[2.5rem] font-medium tracking-[-0.025em] leading-[1.12] text-slate-900">
          A closer look at interruption,
          continuity,
          and behavioural contradiction.
        </h1>

        <p class="text-[1.02rem] leading-[1.9] text-slate-700">
          This reflection explores how attention,
          emotional pressure,
          fragmentation,
          and internal contradiction may be shaping ordinary functioning.
        </p>

      </header>

      <!-- EMAIL CAPTURE -->
      <section
          v-if="!report.overview"
          class="rounded-2xl border border-stone-200 bg-white/70 px-8 py-8"
      >

        <div class="max-w-xl space-y-6">

          <div class="space-y-3">

            <p class="section-label">
              Continue
            </p>

            <h2 class="section-title">
              Receive the full reflection.
            </h2>

          </div>

          <div class="space-y-4 text-[1rem] leading-[1.85] text-slate-700">

            <p>
              The report explores interruption patterns,
              emotional organisation,
              contradiction,
              and continuity breakdowns.
            </p>

            <p>
              The emphasis is behavioural recognition rather than diagnosis or explanation.
            </p>

          </div>

          <input
              v-model="email"
              type="email"
              placeholder="Email address"
              class="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-800 outline-none transition focus:border-slate-500"
          />

          <button
              @click="handleSubmit"
              class="inline-flex items-center rounded-xl border border-slate-900 bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            {{ loading ? "Generating reflection..." : "Receive full reflection" }}
          </button>

          <p class="text-xs leading-relaxed text-slate-500">
            Your email may occasionally receive continuation updates related to MindWorks.
          </p>

        </div>

      </section>

      <!-- TLDR -->
      <section
          v-if="report.tldr"
          class="rounded-2xl border border-slate-200 bg-slate-100 px-8 py-8"
      >

        <div class="mb-5 flex items-center justify-between gap-4 flex-wrap">

          <div>

            <p class="section-label mb-2">
              TL;DR
            </p>

            <h2 class="text-[1.45rem] font-medium text-slate-900">
              Immediate recognition
            </h2>

          </div>

          <button
              @click="downloadReport"
              class="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
          >
            Download report
          </button>

        </div>

        <div
            class="text-[1rem] leading-[1.9] text-slate-700 whitespace-pre-line"
        >
          {{ report.tldr }}
        </div>

      </section>

      <!-- OVERVIEW -->
      <section
          v-if="report.overview"
          class="space-y-5"
      >

        <div class="flex items-center justify-between gap-4 flex-wrap">

          <div>

            <p class="section-label mb-2">
              Section 1
            </p>

            <h2 class="section-title">
              Behavioural patterns
            </h2>

          </div>

          <button
              @click="downloadReport"
              class="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
          >
            Download
          </button>

        </div>

        <div class="report-card">

          <p class="report-copy whitespace-pre-line">
            {{ report.overview }}
          </p>

        </div>

      </section>

      <!-- FUNCTIONING -->
      <section
          v-if="report.functioning"
          class="space-y-5"
      >

        <div class="flex items-center justify-between gap-4 flex-wrap">

          <div>

            <p class="section-label mb-2">
              Section 2
            </p>

            <h2 class="section-title">
              Daily functioning
            </h2>

          </div>

          <button
              @click="downloadReport"
              class="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
          >
            Download
          </button>

        </div>

        <div class="report-card">

          <p class="report-copy whitespace-pre-line">
            {{ report.functioning }}
          </p>

        </div>

      </section>

      <!-- PATTERNS -->
      <section
          v-if="report.patterns"
          class="space-y-5"
      >

        <div class="flex items-center justify-between gap-4 flex-wrap">

          <div>

            <p class="section-label mb-2">
              Section 3
            </p>

            <h2 class="section-title">
              Patterns & trade-offs
            </h2>

          </div>

          <button
              @click="downloadReport"
              class="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
          >
            Download
          </button>

        </div>

        <div class="report-card">

          <p class="report-copy whitespace-pre-line">
            {{ report.patterns }}
          </p>

        </div>

      </section>

      <!-- CONTINUATION -->
      <section
          v-if="report.closing"
          class="rounded-2xl border border-slate-200 bg-white/60 px-8 py-10"
      >

        <div class="max-w-2xl space-y-7">

          <div class="space-y-3">

            <p class="section-label">
              Continuation
            </p>

            <h2 class="section-title">
              Recognition is usually the beginning,
              not the end.
            </h2>

          </div>

          <div class="space-y-5 text-[1rem] leading-[1.9] text-slate-700 whitespace-pre-line">

            <p>
              {{ report.closing }}
            </p>

            <p>
              The six-stage guided path continues this work through:
              embodied attention,
              self-observation,
              interruption recognition,
              and continuity practices integrated into ordinary life.
            </p>

          </div>

          <div class="flex flex-wrap gap-3 pt-2">

            <router-link
                to="/programme"
                class="inline-flex items-center rounded-xl border border-slate-900 bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Explore the programme
            </router-link>

            <button
                @click="downloadReport"
                class="inline-flex items-center rounded-xl border border-slate-300 px-6 py-3 text-sm text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
            >
              Download report
            </button>

          </div>

        </div>

      </section>

    </div>

  </main>
</template>

<script setup>
import { ref } from "vue"

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

  } catch (err) {

    console.error(err)

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
<title>MindWorks Reflection</title>

<style>

body {
  font-family: Arial, sans-serif;
  background: #fafaf9;
  color: #1c1917;
  line-height: 1.85;
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 32px;
}

h1 {
  font-size: 38px;
  margin-bottom: 8px;
}

h2 {
  margin-top: 48px;
  margin-bottom: 12px;
  font-size: 28px;
}

.section {
  margin-bottom: 56px;
  background: white;
  border-radius: 18px;
  border: 1px solid #e7e5e4;
  padding: 28px;
}

.tldr {
  background: #f1f5f9;
  border-radius: 18px;
  padding: 28px;
  margin-bottom: 56px;
}

.footer {
  margin-top: 72px;
  border-top: 1px solid #d6d3d1;
  padding-top: 28px;
  color: #57534e;
}

p {
  margin-bottom: 18px;
}

</style>
</head>

<body>

<h1>MindWorks Reflection</h1>

<p>
Behavioural continuity, interruption patterns, and emotional organisation.
</p>

<div class="tldr">

<h2>TL;DR</h2>

<p>${report.value.tldr}</p>

</div>

<div class="section">

<h2>Behavioural patterns</h2>

<p>${report.value.overview}</p>

</div>

<div class="section">

<h2>Daily functioning</h2>

<p>${report.value.functioning}</p>

</div>

<div class="section">

<h2>Patterns & trade-offs</h2>

<p>${report.value.patterns}</p>

</div>

<div class="footer">

<p>${report.value.closing}</p>

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
  link.download = "mindworks-reflection.html"

  link.click()

  URL.revokeObjectURL(url)

}
</script>

<style scoped>

.section-label {
  @apply text-[11px] uppercase tracking-[0.24em] text-slate-500;
}

.section-title {
  @apply text-[1.8rem] md:text-[2.2rem] font-medium tracking-[-0.025em] leading-[1.16] text-slate-900;
}

.report-card {
  @apply rounded-2xl border border-stone-200 bg-white/70 px-8 py-8;
}

.report-copy {
  @apply text-[1rem] leading-[1.9] text-slate-700;
}

</style>