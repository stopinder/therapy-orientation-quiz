<template>
  <main class="min-h-screen bg-stone-50 pt-10 pb-24 font-sans antialiased">
    <div class="max-w-2xl mx-auto px-4 mt-10">

      <!-- HERO -->
      <section class="mt-10">
        <h1 class="text-3xl md:text-4xl font-medium mb-4">
          Why You Do Things You Don’t Mean To Do
        </h1>

        <div class="text-base md:text-lg">
          <p class="mb-3">
            You start something.<br />
            Then something else takes over.
          </p>

          <p class="mb-3">
            You open your laptop—and check messages instead.<br />
            You plan to speak honestly—and find yourself explaining or withdrawing.<br />
            You mean to follow through—and something shifts.
          </p>

          <p class="font-medium text-slate-900 mb-3">
            This shows you exactly when that happens.
          </p>

          <p class="mb-3">
            You’ll see patterns across real moments—not guesses or imagination.
          </p>

          <p class="mb-3">
            Most approaches ask you to imagine your parts.<br />
            This shows you when they actually take over.
          </p>

          <div class="mt-6">
            <p class="font-medium text-slate-900 mb-3">You’ll begin to notice:</p>
            <ul class="mb-3 list-disc pl-5 text-gray-600">
              <li class="mb-1">what happens as you start</li>
              <li class="mb-1">the moment things shift</li>
              <li class="mb-1">patterns across different situations</li>
              <li class="mb-1">what’s already there before you react</li>
              <li class="mb-1">what your responses lead to</li>
              <li class="mb-1">how different reactions may not be random</li>
            </ul>
          </div>

          <p class="mt-6 mb-3">
            Once you can see it clearly, it stops feeling random.
          </p>

          <p class="text-xl md:text-2xl font-medium text-slate-900 mt-6 mb-3">
            And that’s where change actually begins.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 mt-10">
          <button
              @click="enterProgramme"
              class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-4 text-base font-medium text-white shadow-sm hover:bg-slate-800 transition-all"
          >
            Enter Full Programme
          </button>

          <router-link
              to="/adhd-quiz"
              class="inline-flex items-center justify-center rounded-xl border border-slate-300 px-8 py-4 text-base font-medium text-slate-700 hover:bg-stone-100 transition-all"
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
    router.push({
      path: "/auth",
      query: { redirect: "/structured-interview" }
    })
    return
  }
  router.push("/structured-interview")
}
</script>

<style scoped>
</style>