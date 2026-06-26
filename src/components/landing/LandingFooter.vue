<template>
  <footer class="bg-white px-6 py-16 lg:px-8">
    <div class="mx-auto max-w-5xl border-t border-slate-100 pt-10">
      <div class="flex flex-col items-center justify-between gap-8 sm:flex-row">
        <div class="text-xl font-semibold tracking-tight text-slate-900">
          MindWorks
        </div>
        
        <nav class="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-600">
          <router-link to="/" class="hover:text-slate-900 transition-colors">Home</router-link>
          <router-link to="/about" class="hover:text-slate-900 transition-colors">About</router-link>
          <router-link to="/auth" class="hover:text-slate-900 transition-colors">Sign In</router-link>
          <router-link to="/privacy" class="hover:text-slate-900 transition-colors">Privacy</router-link>
          <router-link to="/terms" class="hover:text-slate-900 transition-colors">Terms</router-link>
        </nav>
      </div>
      
      <div class="mt-12 text-center text-xs text-slate-400">
        &copy; {{ new Date().getFullYear() }} MindWorks. All rights reserved.
      </div>
    </div>
  </footer>
</template>
