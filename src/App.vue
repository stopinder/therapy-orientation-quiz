<template>
  <div class="min-h-screen bg-stone-50 text-slate-900">
    <AppHeader v-if="!route.meta.standalone" />
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from "vue"
import { useRoute } from "vue-router"
import AppHeader from "./components/AppHeader.vue"
import { useAuthStore } from "./stores/auth"

const route = useRoute()
const auth = useAuthStore()

onMounted(async () => {

  await auth.fetchUser()

  auth.listenForAuthChanges()

})
</script>