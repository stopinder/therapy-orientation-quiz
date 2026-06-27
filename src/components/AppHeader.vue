<template>
  <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">

    <div class="mx-auto max-w-5xl px-4 md:px-6 py-3">

      <div class="flex items-center">

        <!-- Brand -->

        <router-link
            to="/"
            class="text-lg md:text-xl font-semibold tracking-tight text-slate-900"
        >
          MindWorks
        </router-link>

        <!-- Navigation -->

        <nav class="ml-auto flex items-center gap-3 md:gap-6 text-sm md:text-base font-medium text-slate-700">

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
              to="/course"
              class="transition hover:text-slate-900"
          >
            My Course
          </router-link>

          <span
              v-if="auth.user?.email"
              class="text-[0.7rem] md:text-xs text-slate-500 font-normal truncate max-w-[80px] md:max-w-none"
          >
            {{ auth.user.email }}
          </span>

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