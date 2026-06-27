<template>
  <div class="mx-auto max-w-xl px-6 py-24 text-center">

    <div class="rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">

      <template v-if="entitlements.loading">
        <div class="flex flex-col items-center py-8">
          <div class="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600"></div>
          <p class="text-slate-600">Checking your course access...</p>
        </div>
      </template>

      <template v-else>
        <h1 class="mb-4 text-3xl font-semibold text-slate-900">
          {{ hasAccess ? 'Welcome to the Programme' : 'Continue the Observation Journey' }}
        </h1>

        <div class="mb-8 space-y-4 leading-relaxed text-slate-600">
          <p v-if="hasAccess">
            Your course access is confirmed. You can now continue with the full six-stage programme.
          </p>
          <template v-else>
            <p>
              Your account is ready, but the full six-stage programme requires course access.
            </p>
            <p>
              You can begin with the Free Orientation, or continue to unlock the full Observation Journey.
            </p>
          </template>
        </div>

        <div class="flex flex-col items-center gap-4">
          <router-link
              v-if="hasAccess"
              to="/course"
              class="w-full max-w-xs rounded-xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-700"
          >
            Go to Course
          </router-link>

          <template v-else>
            <router-link
                to="/adhd-quiz"
                class="w-full max-w-xs rounded-xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-700"
            >
              Start Free Orientation
            </router-link>

            <button
                @click="purchaseProgramme"
                class="w-full max-w-xs rounded-xl border border-slate-300 px-6 py-3 text-slate-700 transition hover:bg-slate-50"
            >
              Unlock Full Programme
            </button>
          </template>

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
import { onMounted, computed } from "vue"
import { useCoursePurchases } from "../composables/useCoursePurchases"
import { useEntitlementStore } from "../stores/entitlements"
import { useAuthStore } from "../stores/auth"

const { purchaseProgramme } = useCoursePurchases()
const entitlements = useEntitlementStore()
const auth = useAuthStore()

const hasAccess = computed(() => entitlements.canAccessWeek(1))

onMounted(async () => {
  // Ensure we have user info before fetching entitlements
  if (!auth.user) {
    await auth.fetchUser()
  }
  
  if (auth.user) {
    await entitlements.fetchEntitlements(auth.user.id, auth.user.email)
  }
})
</script>
