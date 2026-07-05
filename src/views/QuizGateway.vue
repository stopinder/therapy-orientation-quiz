<template>
  <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 px-6 py-24">

    <div class="max-w-2xl mx-auto space-y-16">

      <!-- HERO -->
      <header class="space-y-6 max-w-xl">

        <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">
          MindWorks
        </p>

        <h1 class="text-3xl md:text-[2.45rem] font-medium tracking-[-0.025em] text-slate-900 leading-[1.12]">
          See what you actually do at the moment you start.
        </h1>

        <div class="space-y-4 text-[1.02rem] leading-[1.9] text-slate-700">

          <p>
            This is not about what you think you do. It is about what actually happens, just as you begin.
          </p>

        </div>

      </header>

      <!-- ENTRY -->
      <section class="max-w-xl space-y-6">

        <button
            @click="handleContinue"
            class="inline-flex items-center rounded-xl border border-slate-900 bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          See what happens
        </button>

      </section>

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

.section-label {
  @apply text-[11px] uppercase tracking-[0.24em] text-slate-500;
}

.section-title {
  @apply text-[1.7rem] md:text-[2rem] font-medium tracking-[-0.025em] leading-[1.18] text-slate-900;
}

</style>