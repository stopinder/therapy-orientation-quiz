<template>
  <div class="flex min-h-screen flex-col items-center overflow-y-auto px-6 pb-20 pt-10">

    <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <h1 class="mb-8 text-3xl font-semibold">
        Account Access
      </h1>

      <div
          v-if="signupSuccess"
          class="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm"
      >
        <p class="font-semibold text-emerald-900">Check your email</p>
        <p class="mt-1 text-emerald-800">
          We've sent you a confirmation link. Please confirm your email address, then return here to sign in.
        </p>
      </div>

      <div
          v-if="message"
          class="mb-6 rounded-xl bg-slate-100 p-4 text-sm"
      >
        {{ message }}
      </div>

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

          <div class="mb-2 flex items-center justify-between">
            <label class="text-sm font-medium">
              Password
            </label>

            <button
                type="button"
                @click="sendPasswordReset"
                class="text-xs text-slate-500 transition hover:text-slate-900"
            >
              Forgot Password?
            </button>
          </div>

          <input
              v-model="password"
              type="password"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          />

        </div>

      <div class="flex flex-col gap-4">

          <div class="flex gap-3">
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

        </div>

      </form>

      <button
          v-if="auth.user"
          @click="signOut"
          class="mt-6 block text-sm text-red-600"
      >
        Sign Out
      </button>

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
import { useEntitlementStore } from "../stores/entitlements"

const router = useRouter()

const auth = useAuthStore()

const email = ref("")
const password = ref("")
const message = ref("")
const signupSuccess = ref(false)

const signUp = async () => {

  message.value = ""

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  const redirectUrl = isLocal
      ? `${window.location.origin}/auth`
      : "https://mindworks.works/auth"

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      emailRedirectTo: redirectUrl
    }
  })

  if (error) {
    message.value = error.message
    return
  }

  signupSuccess.value = true
  message.value = ""

  await auth.fetchUser()

}

const signIn = async () => {

  message.value = ""
  signupSuccess.value = false

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    message.value = error.message
    return
  }

  await auth.fetchUser()

  message.value = "Signed in successfully. Checking access..."

  // Explicitly fetch entitlements before routing
  const entitlements = useEntitlementStore()
  if (data?.user) {
      await entitlements.fetchEntitlements(data.user.id, data.user.email)
  }

  if (entitlements.isActive) {
      await router.push("/course")
  } else {
      await router.push("/access-required")
  }

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

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  const redirectUrl = isLocal
      ? `${window.location.origin}/reset-password`
      : "https://mindworks.works/reset-password"

  const { error } = await supabase.auth.resetPasswordForEmail(
      email.value,
      {
        redirectTo: redirectUrl
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