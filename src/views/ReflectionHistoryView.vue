```vue
<template>
  <main class="min-h-screen bg-slate-50 px-6 py-16">

    <div class="mx-auto max-w-5xl">

      <!-- Header -->

      <div class="mb-14">

        <p class="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          Continuity History
        </p>

        <h1 class="text-4xl font-semibold tracking-tight text-slate-950">
          Reflection Timeline
        </h1>

        <p class="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
          A longitudinal view of recurring behavioural themes,
          interruption patterns, continuity shifts, and reflective
          observations across the programme.
        </p>

      </div>

      <!-- Phase 2 Continuity Surface — Pattern + Frequency -->

      <section class="mb-16">

        <div class="overflow-hidden rounded-[2.5rem] border border-slate-900 bg-slate-900 p-10 text-white shadow-2xl">

          <div class="max-w-3xl">

            <p class="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Analysis Surface
            </p>

            <h2 class="text-3xl font-semibold tracking-tight">
              What Keeps Reappearing
            </h2>

            <p class="mt-4 text-lg text-slate-300">
              Patterns that have appeared across recent reflections.
            </p>

            <div class="mt-10 grid gap-4 md:grid-cols-3">

              <div class="rounded-3xl bg-white/10 p-6 backdrop-blur-sm border border-white/10">
                <p class="text-xl font-semibold text-slate-100">
                  Checking before beginning
                </p>
                <p class="mt-1 text-sm text-slate-400">
                  Appeared in 4 reflections
                </p>
              </div>

              <div class="rounded-3xl bg-white/10 p-6 backdrop-blur-sm border border-white/10">
                <p class="text-xl font-semibold text-slate-100">
                  Delay before entry
                </p>
                <p class="mt-1 text-sm text-slate-400">
                  Appeared in 3 reflections
                </p>
              </div>

              <div class="rounded-3xl bg-white/10 p-6 backdrop-blur-sm border border-white/10">
                <p class="text-xl font-semibold text-slate-100">
                  Preparation before action
                </p>
                <p class="mt-1 text-sm text-slate-400">
                  Appeared in 5 reflections
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      <!-- Phase 3 Continuity Surface — Sequence Prototype -->

      <section class="mb-16">

        <div class="overflow-hidden rounded-[2.5rem] border border-slate-900 bg-slate-900 p-10 text-white shadow-2xl">

          <div class="max-w-3xl">

            <p class="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Primary Insight
            </p>

            <h2 class="text-3xl font-semibold tracking-tight">
              Most Common Sequence
            </h2>

            <p class="mt-4 text-lg text-slate-300">
              A sequence that has appeared repeatedly across recent reflections.
            </p>

            <div class="mt-10 inline-flex flex-col items-start gap-4">

              <div class="flex items-center gap-4">
                <div class="flex h-12 w-48 items-center justify-center rounded-2xl bg-white/10 px-6 py-3 border border-white/10">
                  <span class="text-lg font-medium text-slate-100">Intention</span>
                </div>
              </div>

              <div class="flex w-48 justify-center py-1">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-slate-500"
                >
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </div>

              <div class="flex items-center gap-4">
                <div class="flex h-12 w-48 items-center justify-center rounded-2xl bg-white/10 px-6 py-3 border border-white/10">
                  <span class="text-lg font-medium text-slate-100">Checking</span>
                </div>
              </div>

              <div class="flex w-48 justify-center py-1">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-slate-500"
                >
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </div>

              <div class="flex items-center gap-4">
                <div class="flex h-12 w-48 items-center justify-center rounded-2xl bg-white/10 px-6 py-3 border border-white/10">
                  <span class="text-lg font-medium text-slate-100">Delay</span>
                </div>
              </div>

              <div class="flex w-48 justify-center py-1">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-slate-500"
                >
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </div>

              <div class="flex items-center gap-4">
                <div class="flex h-12 w-48 items-center justify-center rounded-2xl bg-white/10 px-6 py-3 border border-white/10">
                  <span class="text-lg font-medium text-slate-100">Recognition</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      <!-- Loading -->

      <div
          v-if="loading"
          class="text-slate-500"
      >
        Restoring continuity history...
      </div>

      <!-- Empty -->

      <div
          v-else-if="!reflections.length"
          class="rounded-3xl border border-slate-200 bg-white p-10 text-slate-500 shadow-sm"
      >
        No reflections recorded yet.
      </div>

      <!-- Timeline -->

      <div
          v-else
          class="space-y-8"
      >

        <section
            v-for="item in reflections"
            :key="item.id"
            class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >

          <!-- Meta -->

          <div class="mb-6 flex flex-wrap items-center justify-between gap-4">

            <div>

              <p class="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                Week {{ item.week_number }}
              </p>

              <h2 class="mt-2 text-2xl font-semibold text-slate-950">
                {{ getWeekTitle(item.week_number) }}
              </h2>

            </div>

            <div
                class="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600"
            >
              {{ formatDate(item.created_at) }}
            </div>

          </div>

          <!-- Original Reflection -->

          <div class="mb-8">

            <h3 class="mb-3 text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
              Original Reflection
            </h3>

            <div
                class="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base leading-8 text-slate-700"
            >
              {{ item.original_reflection }}
            </div>

          </div>

          <!-- AI Reflection -->

          <div>

            <h3 class="mb-3 text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
              MindWorks Reflection
            </h3>

            <div
                class="rounded-2xl border border-slate-200 bg-white p-5 text-base leading-8 text-slate-700 whitespace-pre-line"
            >
              {{ item.ai_response }}
            </div>

          </div>

        </section>

      </div>

    </div>

  </main>
</template>

<script setup>

import {
  onMounted,
  ref
} from "vue"

import { useAuthStore }
  from "../stores/auth"

import { courseWeeks }
  from "../data/courseWeeks"

const auth =
    useAuthStore()

const reflections =
    ref([])

const loading =
    ref(true)

const getWeekTitle =
    (weekNumber) => {

      const week =
          courseWeeks.find(
              (item) =>
                  item.number ===
                  weekNumber
          )

      return (
          week?.title ||
          "Unknown Week"
      )

    }

const formatDate =
    (dateString) => {

      return new Date(
          dateString
      ).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "long",
            day: "numeric"
          }
      )

    }

const loadReflections =
    async () => {

      try {

        if (
            !auth.user?.id
        ) {
          return
        }

        const result = await fetch(
            "/api/getReflectionHistory",
            {
              method: "POST",

              headers: {
                "Content-Type":
                    "application/json"
              },

              body: JSON.stringify({

                userId:
                auth.user.id

              })
            }
        )

        const data =
            await result.json()

        reflections.value =
            data.reflections || []

      } catch (err) {

        console.error(
            "TIMELINE ERROR:",
            err
        )

      } finally {

        loading.value =
            false

      }

    }

onMounted(async () => {

  await loadReflections()

})
</script>
```
