<template>
  <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50 px-6 py-24">

    <div class="max-w-2xl mx-auto space-y-16">

      <!-- HERO -->
      <header class="space-y-6 max-w-xl">

        <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">
          Guided Reflection
        </p>

        <h1 class="text-3xl md:text-[2.45rem] font-medium tracking-[-0.025em] text-slate-900 leading-[1.12]">
          The difficulty is often not knowing what matters.
          It is remaining in contact long enough to continue.
        </h1>

        <div class="space-y-4 text-[1.02rem] leading-[1.9] text-slate-700">

          <p>
            Most people already understand what they intend to do.
            The problem is that attention fragments,
            emotion intervenes,
            pressure accumulates,
            and continuity quietly disappears underneath awareness.
          </p>

          <p>
            This reflection explores the internal organisation behind that process:
            interruption,
            avoidance,
            emotional overload,
            contradiction,
            and unstable continuation.
          </p>

        </div>

      </header>

      <!-- EXPECTATION -->
      <section class="rounded-2xl border border-stone-200 bg-white/65 px-7 py-7">

        <div class="space-y-6">

          <div class="space-y-3">

            <p class="section-label">
              What to expect
            </p>

            <h2 class="section-title">
              A brief behavioural reflection rather than a test.
            </h2>

          </div>

          <div class="space-y-4 text-[1rem] leading-[1.85] text-slate-700">

            <p>
              The process takes around two to three minutes.
            </p>

            <p>
              It does not attempt to diagnose you or categorise your identity.
              The aim is simply to recognise patterns more clearly.
            </p>

            <p>
              At the end,
              you will receive a structured written reflection exploring:
              continuity,
              emotional load,
              contradiction,
              and interruption patterns.
            </p>

          </div>

        </div>

      </section>

      <!-- ENTRY -->
      <section class="max-w-xl space-y-6">

        <div class="space-y-4 text-[1rem] leading-[1.9] text-slate-700">

          <p>
            There are no perfect answers here.
          </p>

          <p>
            Most people recognise themselves gradually,
            often in the smaller moments:
            drifting,
            postponing,
            restarting,
            disappearing under pressure,
            then returning later with clarity.
          </p>

        </div>

        <button
            @click="handleContinue"
            class="inline-flex items-center rounded-xl border border-slate-900 bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Begin the reflection
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