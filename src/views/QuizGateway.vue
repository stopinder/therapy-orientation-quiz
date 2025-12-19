<template>
  <main class="min-h-screen bg-stone-50 px-6 py-20">
    <div class="max-w-2xl mx-auto space-y-8">
      <h1 class="text-3xl font-semibold tracking-tight text-slate-900">
        Before you continue
      </h1>

      <p class="text-lg text-slate-700">
        This reflection is structured, clinically informed, and designed to be taken seriously.
        It is not diagnostic.
      </p>

      <ul class="list-disc pl-5 text-slate-700 space-y-2">
        <li>5–10 minutes</li>
        <li>No labels or diagnoses</li>
        <li>Written clinical-style reflection</li>
      </ul>

      <label class="mt-6 flex items-start gap-3 text-sm text-slate-600">
        <input
            type="checkbox"
            v-model="emailOptIn"
            class="mt-1 h-4 w-4 accent-slate-700"
        />
        <span>
          I’d like to receive occasional emails about new MindWorks reflections and tools.
          <span class="block text-xs text-slate-500">
            No mailing lists. You can unsubscribe at any time.
          </span>
        </span>
      </label>

      <div class="pt-6">
        <button
            @click="handleContinue"
            class="inline-block rounded-md bg-slate-900 px-6 py-3 text-white font-medium hover:bg-slate-800 transition"
        >
          Continue to the quiz
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import { supabase } from "../lib/supabase.js"

const router = useRouter()
const route = useRoute()

const emailOptIn = ref(false)

const handleContinue = async () => {
  const orderId = route.query.order_id

  if (emailOptIn.value && supabase && orderId) {
    await supabase
        .from("email_optins")
        .update({ opt_in: true })
        .eq("order_id", orderId)
  }

  // mark gateway as completed for this session
  sessionStorage.setItem("passedGateway", "true")

  router.push("/adhd-quiz")
}
</script>
