<template>
  <div class="mx-auto max-w-md px-6 py-20">

    <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h1 class="mb-6 text-3xl font-semibold">
        Reset Password
      </h1>

      <p class="mb-6 text-sm leading-relaxed text-slate-600">
        Enter a new password for your account.
      </p>

      <form
          class="space-y-5"
          @submit.prevent="updatePassword"
      >

        <div>

          <label class="mb-2 block text-sm font-medium">
            New Password
          </label>

          <input
              v-model="password"
              type="password"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          />

        </div>

        <button
            type="submit"
            class="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700"
        >
          Update Password
        </button>

      </form>

      <div
          v-if="message"
          class="mt-6 rounded-xl bg-slate-100 p-4 text-sm"
      >
        {{ message }}
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue"

import { supabase } from "../lib/supabase"

const password = ref("")
const message = ref("")

const updatePassword = async () => {

  message.value = ""

  const { error } = await supabase.auth.updateUser({
    password: password.value
  })

  if (error) {
    message.value = error.message
    return
  }

  message.value = "Password updated successfully."

}
</script>