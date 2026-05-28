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
