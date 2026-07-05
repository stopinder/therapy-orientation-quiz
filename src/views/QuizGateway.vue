<template>
  <main class="min-h-screen bg-stone-50 px-6 py-24">

    <div class="max-w-2xl mx-auto">

      <div class="space-y-12">
        <header class="space-y-6">
          <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Orientation
          </p>
          <h1 class="text-3xl md:text-[2.6rem] font-medium tracking-[-0.02em] leading-[1.12] text-stone-900">
            Welcome to MindWorks
          </h1>
        </header>

        <div class="space-y-6 text-[1.1rem] leading-[1.8] text-slate-700">
          <p>
            Recognising patterns across time begins with observation.
          </p>
          <p>
            The Free Orientation introduces the way MindWorks helps recurring behaviours become visible through repeated observation.
          </p>
          <p>
            This is a guided process. There are no scores or labels.
          </p>
        </div>

        <div class="pt-4">
          <button
            @click="handleContinue"
            class="inline-flex items-center rounded-xl bg-slate-900 px-10 py-4 text-base font-medium text-white transition hover:bg-slate-800 shadow-sm"
          >
            Begin Orientation
          </button>
        </div>
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

<style scoped>
</style>