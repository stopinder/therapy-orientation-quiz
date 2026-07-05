<template>
  <main class="min-h-screen bg-stone-50 pt-10 pb-24 font-sans antialiased">

    <div class="max-w-2xl mx-auto px-4 mt-10">

      <div class="mt-10">
        <header class="mb-4">
          <p class="text-sm text-gray-600 mb-4">
            Orientation
          </p>
          <h1 class="text-3xl md:text-4xl font-medium mb-4">
            Welcome to MindWorks
          </h1>
        </header>

        <div class="text-base md:text-lg">
          <p class="mb-3">
            Recognising patterns across time begins with observation.
          </p>
          <p class="mb-3">
            The Free Orientation introduces the way MindWorks helps recurring behaviours become visible through repeated observation.
          </p>
          <p class="mb-3">
            This is a guided process. There are no scores or labels.
          </p>
        </div>

        <div class="mt-6">
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