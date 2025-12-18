<template>
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
    <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

      <!-- Brand -->
      <div class="text-lg font-semibold tracking-tight text-slate-900">
        MindWorks
      </div>

      <!-- Navigation -->
      <nav class="flex items-center gap-6 text-sm font-medium text-slate-700">
        <router-link to="/about" class="hover:text-slate-900 transition">
          About
        </router-link>

        <router-link to="/adhd-quiz" class="hover:text-slate-900 transition">
          ADHD Quiz
        </router-link>
      </nav>

    </div>
  </header>


</template>
