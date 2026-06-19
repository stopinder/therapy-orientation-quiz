<template>
  <div class="mx-auto max-w-xl px-6 py-24 text-center">
    <div class="rounded-3xl border border-slate-200 bg-white p-12 shadow-sm text-slate-900">
      <h1 class="mb-4 text-3xl font-semibold">
        Payment Success
      </h1>

      <div v-if="loading" class="space-y-4">
        <p class="leading-relaxed text-slate-600">
          Payment received. Checking your course access...
        </p>
        <div class="flex justify-center">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
        </div>
      </div>

      <div v-else-if="!auth.user" class="space-y-6">
        <p class="leading-relaxed text-slate-600">
          Thank you for your purchase. Please log in using the same email you purchased with to access your course.
        </p>
        <router-link
            to="/auth"
            class="inline-flex rounded-xl bg-slate-900 px-8 py-3 text-white transition hover:bg-slate-700"
        >
          Go to Login
        </router-link>
      </div>

      <div v-else-if="hasProgrammeAccess" class="space-y-6">
        <p class="leading-relaxed text-slate-600">
          Your access is active! You can now start the programme.
        </p>
        <router-link
            to="/course"
            class="inline-flex rounded-xl bg-emerald-600 px-8 py-3 text-white transition hover:bg-emerald-700 font-medium"
        >
          Enter Course Hub
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <p class="leading-relaxed text-slate-600">
          Your payment has been received. Access may take a few moments to activate.
        </p>
        <button
            @click="checkAccess"
            class="inline-flex rounded-xl bg-slate-900 px-8 py-3 text-white transition hover:bg-slate-700 font-medium"
        >
          Check again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/auth"
import { useCoursePurchases } from "../composables/useCoursePurchases"
import { useEntitlementStore } from "../stores/entitlements"

const auth = useAuthStore()
const entitlements = useEntitlementStore()
const { hasProgrammeAccess, loading } = useCoursePurchases()
const router = useRouter()

const checkAccess = async () => {
  if (auth.user) {
    await entitlements.fetchEntitlements(auth.user.id, auth.user.email)
  }
}

// Automatically redirect if access is found
watch(hasProgrammeAccess, (active) => {
  if (active) {
    setTimeout(() => {
      router.push("/course")
    }, 2000)
  }
})

onMounted(async () => {
  await checkAccess()
})
</script>
