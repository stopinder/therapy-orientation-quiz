<script setup>
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div>
    <h1>Auth Debug</h1>

    <h2>User</h2>
    <pre>{{ auth.user }}</pre>

    <h2>Session</h2>
    <pre>{{ auth.session }}</pre>

    <h2>Authenticated?</h2>
    <pre>{{ auth.isAuthenticated }}</pre>
  </div>
</template>