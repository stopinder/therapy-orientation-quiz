<template>
  <div
      v-if="loading"
      class="mx-auto max-w-4xl px-6 py-20 text-slate-500"
  >
    Checking access...
  </div>

  <div
      v-else-if="hasAccess"
      class="mx-auto max-w-4xl px-6 py-16"
  >

    <div class="mb-10">

      <router-link
          to="/course"
          class="mb-6 inline-flex text-sm text-slate-500 hover:text-slate-800"
      >
        ← Back to Course
      </router-link>

      <h1 class="text-4xl font-semibold tracking-tight">
        Week {{ weekNumber }}
      </h1>

      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
        Placeholder lesson content.
      </p>

    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">

      <p class="leading-relaxed text-slate-700">
        This is where your protected course content will live.
      </p>

    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"

import { useRoute, useRouter } from "vue-router"

import { useAuthStore } from "../stores/auth"
import { useEntitlementStore } from "../stores/entitlements"

const route = useRoute()
const router = useRouter()

const auth = useAuthStore()
const entitlements = useEntitlementStore()

const loading = ref(true)
const hasAccess = ref(false)

const weekNumber = computed(() =>
    Number(route.params.weekNumber)
)

onMounted(async () => {

  if (!auth.user) {
    await router.push("/auth")
    return
  }

  await entitlements.fetchEntitlements(auth.user.id)

  hasAccess.value = entitlements.canAccessWeek(
      weekNumber.value
  )

  if (!hasAccess.value) {

    await router.push("/access-denied")

    return

  }

  loading.value = false

})
</script>