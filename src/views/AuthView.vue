<template>
  <div class="flex min-h-screen flex-col items-center overflow-y-auto px-6 pb-20 pt-10">

    <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <!-- Sign In / Sign Up Tabs -->
      <div class="mb-6 flex border-b border-slate-100">
        <button
            @click="isSignUp = false"
            :class="[
              'flex-1 pb-4 text-sm font-medium transition-all',
              !isSignUp ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'
            ]"
        >
          Sign In
        </button>
        <button
            @click="isSignUp = true"
            :class="[
              'flex-1 pb-4 text-sm font-medium transition-all',
              isSignUp ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'
            ]"
        >
          Sign Up
        </button>
      </div>

      <!-- Authentication Status Area -->
      <div
          v-if="status"
          :class="[
            'mb-6 rounded-xl p-4 text-sm transition-all duration-200',
            status.type === 'success' ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50 border border-slate-100'
          ]"
      >
        <div class="flex gap-3">
          <span v-if="status.type === 'success'" class="text-emerald-500 font-bold">✓</span>
          <span v-else class="text-slate-400 font-bold">✕</span>
          <div>
            <p :class="[
              'font-semibold',
              status.type === 'success' ? 'text-emerald-900' : 'text-slate-900'
            ]">
              {{ status.title }}
            </p>
            <p v-if="status.description" :class="[
              'mt-1 leading-relaxed',
              status.type === 'success' ? 'text-emerald-800' : 'text-slate-600'
            ]">
              {{ status.description }}
            </p>
          </div>
        </div>
      </div>

      <form
          class="space-y-5"
          @submit.prevent="isSignUp ? signUp() : signIn()"
      >

        <div>

          <label class="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
              v-model="email"
              type="email"
              placeholder="user@example.com"
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
                class="text-xs text-slate-400 transition hover:text-slate-900"
            >
              Forgot password?
            </button>
          </div>

          <input
              v-model="password"
              type="password"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          />

        </div>

      <div class="pt-1">

            <button
                type="submit"
                class="w-full rounded-xl bg-slate-900 py-3.5 font-medium text-white transition hover:bg-slate-800"
            >
              {{ isSignUp ? 'Sign Up' : 'Sign In' }}
            </button>

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
import { ref, watch } from "vue"
import { useRouter } from "vue-router"

import { supabase } from "../lib/supabase"
import { useAuthStore } from "../stores/auth"
import { useEntitlementStore } from "../stores/entitlements"

const router = useRouter()

const auth = useAuthStore()

const email = ref("")
const password = ref("")
const status = ref(null)
const isSignUp = ref(false)

const setStatus = (type, title, description = "") => {
  status.value = { type, title, description }
}

// Reset status when switching tabs
watch(isSignUp, () => {
  status.value = null
})

const signUp = async () => {
  status.value = null

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  const redirectUrl = isLocal
      ? `${window.location.origin}/auth/callback`
      : "https://mindworks.works/auth/callback"

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      emailRedirectTo: redirectUrl
    }
  })

  if (error) {
    if (error.message === "User already registered") {
      setStatus("error", "Email already registered.")
    } else {
      console.error("Sign up error:", error)
      setStatus("error", "Unable to sign up.", error.message)
    }
    return
  }

  setStatus("success", "Check your email", "We've sent a confirmation link to your email address. Please confirm your email, then return here to sign in.")

  await auth.fetchUser()
}

const signIn = async () => {
  status.value = null

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    console.error("Sign in error:", {
      message: error.message,
      status: error.status,
      name: error.name,
      email: email.value
    })
    setStatus("error", "Unable to sign in.", error.message)
    return
  }

  await auth.fetchUser()

  setStatus("success", "Signed in successfully", "Checking access...")

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
  setStatus("success", "Signed out.")
  await router.push("/about")
}

const sendPasswordReset = async () => {
  if (!email.value) {
    setStatus("error", "Please enter your email address first.")
    return
  }

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  const redirectUrl = isLocal
      ? `${window.location.origin}/auth/callback`
      : "https://mindworks.works/auth/callback"

  const { error } = await supabase.auth.resetPasswordForEmail(
      email.value,
      {
        redirectTo: redirectUrl
      }
  )

  if (error) {
    setStatus("error", error.message)
    return
  }

  setStatus("success", "Check your email", "We've sent a password reset link.")
}
</script>npm run dev