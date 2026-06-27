<template>
  <div class="mx-auto max-w-xl px-6 py-24 text-center">
    <div class="rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
      
      <template v-if="loading">
        <div class="flex flex-col items-center py-8">
          <div class="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600"></div>
          <p class="text-slate-600 italic">Checking your course access...</p>
        </div>
      </template>

      <template v-else-if="hasAccess">
        <div class="mb-6 flex justify-center text-emerald-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="mb-4 text-3xl font-semibold text-slate-900">
          Your course access is ready
        </h1>
        <p class="mb-8 leading-relaxed text-slate-600">
          Your full Observation Journey is now available.
        </p>
        <div class="flex flex-col items-center gap-4">
          <router-link
            to="/course"
            class="w-full max-w-xs rounded-xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-700 font-medium"
          >
            Go to Course
          </router-link>
        </div>
      </template>

      <template v-else>
        <div class="mb-6 flex justify-center text-amber-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="mb-4 text-3xl font-semibold text-slate-900">
          Payment received
        </h1>
        <p class="mb-8 leading-relaxed text-slate-600">
          Your course access is still being confirmed. This can take a moment.
        </p>
        <div class="flex flex-col items-center gap-4">
          <button
            @click="checkAccess(true)"
            class="w-full max-w-xs rounded-xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-700 font-medium"
          >
            Check Again
          </button>
          <router-link
            to="/"
            class="mt-4 text-sm text-slate-500 hover:text-slate-800"
          >
            Return Home
          </router-link>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue"
import { useEntitlementStore } from "../stores/entitlements"
import { useAuthStore } from "../stores/auth"

const entitlements = useEntitlementStore()
const auth = useAuthStore()

const loading = ref(true)
const hasAccess = computed(() => entitlements.canAccessWeek(1))
const retryCount = ref(0)
let retryTimer = null

const checkAccess = async (isManual = false) => {
  if (isManual) {
    loading.value = true
  }
  
  if (!auth.user) {
    await auth.fetchUser()
  }
  
  if (auth.user) {
    await entitlements.fetchEntitlements(auth.user.id, auth.user.email)
  }
  
  loading.value = false

  // Automatic retry logic if access not found and not a manual click
  if (!hasAccess.value && !isManual && retryCount.value < 2) {
    retryCount.value++
    const delay = retryCount.value === 1 ? 2000 : 5000
    
    retryTimer = setTimeout(() => {
      checkAccess()
    }, delay)
  }
}

onMounted(async () => {
  await checkAccess()
})

onUnmounted(() => {
  if (retryTimer) {
    clearTimeout(retryTimer)
  }
})
</script>
