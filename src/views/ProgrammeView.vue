<template>
  <main class="min-h-screen bg-stone-50 px-6 pt-16 pb-24">
    <div class="max-w-2xl mx-auto space-y-16">

      <!-- HERO -->
      <section class="space-y-8">
        <h1 class="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-slate-900">
          Why You Do Things You Don’t Mean To Do
        </h1>

        <div class="space-y-6 text-xl leading-relaxed text-slate-700">
          <p>
            You start something.<br />
            Then something else takes over.
          </p>

          <p>
            You open your laptop—and check messages instead.<br />
            You plan to speak honestly—and find yourself explaining or withdrawing.<br />
            You mean to follow through—and something shifts.
          </p>

          <p class="font-medium text-slate-900">
            This shows you exactly when that happens.
          </p>

          <p>
            You’ll see patterns across real moments—not guesses or imagination.
          </p>

          <p>
            Most approaches ask you to imagine your parts.<br />
            This shows you when they actually take over.
          </p>

          <div class="space-y-4 pt-4">
            <p class="font-medium text-slate-900">You’ll begin to notice:</p>
            <ul class="space-y-3 list-disc pl-5 text-slate-700">
              <li>what happens as you start</li>
              <li>the moment things shift</li>
              <li>patterns across different situations</li>
              <li>what’s already there before you react</li>
              <li>what your responses lead to</li>
              <li>how different reactions may not be random</li>
            </ul>
          </div>

          <p class="pt-4">
            Once you can see it clearly, it stops feeling random.
          </p>

          <p class="text-2xl font-medium text-slate-900 pt-2">
            And that’s where change actually begins.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 pt-12">
          <button
              @click="enterProgramme"
              class="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-slate-800 transition-all"
          >
            Enter Full Programme
          </button>

          <router-link
              to="/adhd-quiz"
              class="inline-flex items-center justify-center rounded-full border border-slate-300 px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-100 transition-all"
          >
            Begin Free Orientation
          </router-link>
        </div>
      </section>

    </div>
  </main>
</template>

<script setup>
import { useAuthStore } from "../stores/auth"
import { useRouter } from "vue-router"
import { supabase } from "../lib/supabase"

const router = useRouter()
const auth = useAuthStore()

const enterProgramme = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    router.push("/auth")
    return
  }
  router.push("/course")
}
</script>

<style scoped>
</style>