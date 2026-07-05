<template>
  <main class="min-h-screen bg-stone-50 px-6 py-24">

    <div class="max-w-2xl mx-auto">

      <div class="space-y-8">
        <div class="text-[1.1rem] leading-[1.8] text-slate-800 whitespace-pre-line">
You don’t need to think too much about this.

Just bring to mind a recent moment.

You started something—
and then something else happened instead.

That’s enough.

What happened?
        </div>

        <div class="space-y-6">
          <textarea
            v-model="observation"
            placeholder="Describe what happened..."
            rows="6"
            class="w-full rounded-2xl border border-stone-300 bg-white p-6 text-lg leading-relaxed text-slate-800 outline-none transition focus:border-slate-900 shadow-sm"
          ></textarea>

          <button
            @click="handleContinue"
            :disabled="!observation.trim()"
            class="inline-flex items-center rounded-xl border border-slate-900 bg-slate-900 px-8 py-4 text-base font-medium text-white transition hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            See what happens
          </button>
        </div>
      </div>

    </div>

  </main>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const observation = ref("")

const handleContinue = () => {

  sessionStorage.setItem("passedGateway", "true")
  
  // Store the initial observation if we want to carry it forward
  if (observation.value.trim()) {
    sessionStorage.setItem("initial_observation", observation.value.trim())
  }

  router.push("/adhd-quiz")

}
</script>

<style scoped>
</style>