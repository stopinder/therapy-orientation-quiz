<template>
  <main class="min-h-screen bg-slate-50 px-6 py-16">
    <div class="mx-auto max-w-4xl">

      <div class="mb-12">
        <router-link
            to="/course"
            class="mb-8 inline-flex items-center text-sm text-slate-500 transition hover:text-slate-900"
        >
          ← Back to Course
        </router-link>

        <p class="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          Week 1
        </p>

        <h1 class="text-4xl font-semibold tracking-tight text-slate-950">
          Recognition & Fragmentation
        </h1>

        <p class="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
          This week begins with the moment continuity disappears. Not as a
          failure of discipline, but as something observable: a shift, a loss of
          contact, a quiet departure from what you meant to stay with.
        </p>
      </div>

      <section class="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 class="text-2xl font-semibold text-slate-950">
          Opening reflection
        </h2>

        <div class="mt-5 space-y-5 text-base leading-8 text-slate-700">
          <p>
            Continuity often disappears before you notice it has gone. You may
            begin with a clear intention, a task, a message, a decision, or a
            simple movement toward something important. Then, without a clear
            moment of choosing, you are elsewhere.
          </p>

          <p>
            The movement may look ordinary from the outside. You check something,
            prepare something, tidy something, think through one more detail, or
            drift into a different demand. Internally, something has broken
            contact.
          </p>

          <p>
            This week is not about correcting that movement. It is about seeing
            it clearly enough that it becomes recognisable. The important moment
            is not the collapse afterwards. It is the earlier shift: the instant
            where contact weakens and another behaviour begins to organise you.
          </p>

          <p>
            Your task this week is simple: notice the disappearance. Not the
            explanation. Not the story. Not the self-criticism afterwards. Just
            the movement from intention into fragmentation.
          </p>
        </div>
      </section>

      <section class="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 class="text-2xl font-semibold text-slate-950">
          Audio reflection
        </h2>

        <p class="mt-4 text-base leading-7 text-slate-600">
          Add your Week 1 audio reflection here later. This section is intentionally
          spacious and minimal to preserve pacing and attention.
        </p>

        <div class="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <p class="text-sm text-slate-500">
            Audio placeholder
          </p>
        </div>
      </section>

      <section class="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 class="text-2xl font-semibold text-slate-950">
          Observation exercises
        </h2>

        <div class="mt-6 grid gap-4">
          <div
              v-for="exercise in exercises"
              :key="exercise.title"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <h3 class="font-medium text-slate-950">
              {{ exercise.title }}
            </h3>

            <p class="mt-2 text-sm leading-6 text-slate-600">
              {{ exercise.description }}
            </p>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 class="text-2xl font-semibold text-slate-950">
          Reflect with MindWorks
        </h2>

        <p class="mt-4 text-base leading-7 text-slate-600">
          Describe one moment where continuity weakened without a clear decision
          to leave the original intention.
        </p>

        <textarea
            v-model="reflection"
            rows="8"
            class="mt-6 w-full rounded-2xl border border-slate-300 bg-white p-4 text-base leading-7 text-slate-800 outline-none transition focus:border-slate-900"
            placeholder="Describe what happened..."
        />

        <button
            type="button"
            :disabled="loading || !reflection.trim()"
            @click="submitReflection"
            class="mt-5 rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {{ loading ? "Reflecting..." : "Generate reflection" }}
        </button>

        <div
            v-if="error"
            class="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700"
        >
          {{ error }}
        </div>

        <div
            v-if="response"
            class="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6"
        >
          <h3 class="mb-4 font-medium text-slate-950">
            Reflection
          </h3>

          <div class="whitespace-pre-line text-base leading-8 text-slate-700">
            {{ response }}
          </div>
        </div>
      </section>

    </div>
  </main>
</template>

<script setup>
import { ref } from "vue"

const reflection = ref("")
const response = ref("")
const loading = ref(false)
const error = ref("")

const exercises = [
  {
    title: "Notice the departure",
    description:
        "Notice the moment attention leaves the original intention before you fully realise it has happened."
  },

  {
    title: "Track the substitute",
    description:
        "Observe what activity replaces the original movement. Preparation, checking, planning, or tidying may create the feeling of engagement without actual entry."
  },

  {
    title: "Observe the shift",
    description:
        "Pay attention to emotional or pressure changes appearing immediately before continuity weakens."
  }
]

const submitReflection = async () => {

  error.value = ""
  response.value = ""
  loading.value = true

  try {

    const result = await fetch(
        "/api/courseReflection",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            week: 1,
            reflection: reflection.value
          })
        }
    )

    const text = await result.text()

    let data = {}

    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      throw new Error("Invalid server response")
    }

    if (!result.ok) {

      throw new Error(
          data.error || "Reflection generation failed."
      )

    }

    response.value = data.reflection || ""

  } catch (err) {

    error.value =
        err.message || "Something went wrong."

  } finally {

    loading.value = false

  }

}
</script>