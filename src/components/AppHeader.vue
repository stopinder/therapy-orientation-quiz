<template>
  <header class="w-full border-b border-slate-200 bg-white">
    <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

      <div class="text-lg font-semibold tracking-tight text-slate-900">
        MindWorks
      </div>

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
