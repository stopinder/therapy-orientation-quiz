<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">

    <div class="mx-auto max-w-5xl px-6 py-3">

      <div class="flex items-center">

        <!-- Brand -->

        <router-link
            to="/"
            class="text-xl font-semibold tracking-tight text-slate-900"
        >
          MindWorks
        </router-link>

        <!-- Navigation -->

        <nav class="ml-auto flex items-center gap-6 text-base font-medium text-slate-700">

          <router-link
              to="/"
              class="transition hover:text-slate-900"
          >
            Home
          </router-link>

          <router-link
              to="/about"
              class="transition hover:text-slate-900"
          >
            About
          </router-link>

          <router-link
              to="/gateway"
              class="text-slate-800 transition hover:text-slate-900"
          >
            Orientation
          </router-link>

          <router-link
              v-if="!auth.user"
              to="/auth"
              class="transition hover:text-slate-900"
          >
            Sign In
          </router-link>

          <router-link
              v-if="auth.user"
              to="/investigation-home"
              class="transition hover:text-slate-900"
          >
            My Investigation
          </router-link>

          <button
              v-if="auth.user"
              @click="handleSignOut"
              class="transition hover:text-slate-900"
          >
            Sign Out
          </button>

        </nav>

      </div>

    </div>

  </header>
</template>

<script setup>
import { useRouter } from "vue-router"

import { useAuthStore } from "../stores/auth"

const router = useRouter()

const auth = useAuthStore()

const handleSignOut = async () => {

  await auth.signOut()

  await router.push("/about")

}
</script>