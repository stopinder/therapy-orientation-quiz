<template>
  <div class="min-h-screen bg-stone-50 text-slate-900">
    <AppHeader />
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from "vue"
import AppHeader from "./components/AppHeader.vue"
import { useAuthStore } from "./stores/auth"

const auth = useAuthStore()

onMounted(async () => {

  await auth.fetchUser()

  auth.listenForAuthChanges()

})
</script>