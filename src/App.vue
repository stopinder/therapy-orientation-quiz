<template>
  <div class="min-h-screen bg-stone-50 text-slate-900">
    <AppHeader />
    <router-view />
  </div>
</template>

<script setup>
import AppHeader from "./components/AppHeader.vue"
</script>
