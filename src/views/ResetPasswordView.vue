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

        <div class="relative">

          <label class="mb-2 block text-sm font-medium">
            New Password
          </label>

          <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-slate-500"
              placeholder="Enter your new password"
          />

          <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-[38px] flex h-10 w-10 items-center justify-center text-slate-400 hover:text-slate-600 focus:outline-none"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
          >
            <svg
                v-if="showPassword"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
              <path d="M9.88 9.88L4.62 4.62" />
              <path d="M1 1l22 22" />
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
              <path d="M15.53 15.53a3 3 0 0 1-4.24-4.24" />
            </svg>
            <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

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
const showPassword = ref(false)
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