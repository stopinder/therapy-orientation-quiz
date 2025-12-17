<template>
  <div>
    <!-- Navigation -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <nav class="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <h1 class="text-lg font-semibold text-stone-800">MindSystems</h1>

        <ul class="flex space-x-6 text-stone-600">
          <li>
            <router-link
                to="/adhd-quiz"
                class="hover:text-stone-900 transition-colors"
            >
              ADHD Quiz
            </router-link>
          </li>
          <li>
            <router-link
                to="/about"
                class="hover:text-stone-900 transition-colors"
            >
              About
            </router-link>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Page content -->
    <main class="min-h-screen bg-gradient-to-b from-stone-100 to-stone-50">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// no logic needed yet
</script>
