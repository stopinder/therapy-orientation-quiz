<template>
  <div class="mx-auto max-w-md px-6 py-20">

    <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h1 class="mb-8 text-3xl font-semibold">
        Account Access
      </h1>

      <form
          class="space-y-5"
          @submit.prevent="signIn"
      >

        <div>

          <label class="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
              v-model="email"
              type="email"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          />

        </div>

        <div>

          <label class="mb-2 block text-sm font-medium">
            Password
          </label>

          <input
              v-model="password"
              type="password"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          />

        </div>

        <div class="flex gap-3 pt-2">

          <button
              type="button"
              @click="signUp"
              class="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700"
          >
            Sign Up
          </button>

          <button
              type="submit"
              class="rounded-xl border border-slate-300 px-5 py-3 transition hover:bg-slate-100"
          >
            Sign In
          </button>

        </div>

      </form>

      <button
          @click="sendPasswordReset"
          class="mt-6 text-sm text-slate-500 transition hover:text-slate-900"
      >
        Forgot Password?
      </button>

      <button
          v-if="auth.user"
          @click="signOut"
          class="mt-6 block text-sm text-red-600"
      >
        Sign Out
      </button>

      <div
          v-if="message"
          class="mt-6 rounded-xl bg-slate-100 p-4 text-sm"
      >
        {{ message }}
      </div>

      <div
          v-if="auth.user"
          class="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm"
      >
        Logged in as:
        <strong>{{ auth.user.email }}</strong>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

import { supabase } from "../lib/supabase"
import { useAuthStore } from "../stores/auth"

const router = useRouter()

const auth = useAuthStore()

const email = ref("")
const password = ref("")
const message = ref("")

const signUp = async () => {

  message.value = ""

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (error) {
    message.value = error.message
    return
  }

  message.value =
      "Account created. Check your email if confirmation is enabled."

  await auth.fetchUser()

}

const signIn = async () => {

  message.value = ""

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    message.value = error.message
    return
  }

  await auth.fetchUser()

  message.value = "Signed in successfully."

  await router.push("/course")

}

const signOut = async () => {

  await auth.signOut()

  message.value = "Signed out."

  await router.push("/about")

}

const sendPasswordReset = async () => {

  if (!email.value) {

    message.value = "Please enter your email address first."

    return

  }

  const { error } = await supabase.auth.resetPasswordForEmail(
      email.value,
      {
        redirectTo:
            `${window.location.origin}/reset-password`
      }
  )

  if (error) {

    message.value = error.message

    return

  }

  message.value =
      "Password reset email sent."

}
</script>npm run dev