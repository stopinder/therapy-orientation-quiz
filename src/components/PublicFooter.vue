<template>
  <footer class="bg-white border-t border-slate-100 py-16 px-6 sm:py-20">
    <div class="mx-auto max-w-5xl">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div class="space-y-4">
          <div class="text-xl font-semibold tracking-tight text-slate-900">
            MindWorks
          </div>
          <p class="text-sm text-slate-500 max-w-xs leading-relaxed">
            Recognising patterns across time.
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div class="space-y-4">
            <h4 class="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Navigation
            </h4>
            <nav class="flex flex-col gap-3 text-sm text-slate-600">
              <router-link to="/" class="hover:text-slate-900 transition-colors">Home</router-link>
              <router-link to="/about" class="hover:text-slate-900 transition-colors">About</router-link>
              <router-link to="/contact" class="hover:text-slate-900 transition-colors">Contact</router-link>
              <a href="https://therapyworks.works" target="_blank" rel="noopener" class="hover:text-slate-900 transition-colors">TherapyWorks</a>
            </nav>
          </div>

          <div class="space-y-4">
            <h4 class="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Legal
            </h4>
            <nav class="flex flex-col gap-3 text-sm text-slate-600">
              <router-link to="/privacy" class="hover:text-slate-900 transition-colors">Privacy Policy</router-link>
              <router-link to="/terms" class="hover:text-slate-900 transition-colors">Terms & Conditions</router-link>
            </nav>
          </div>

          <div class="space-y-4">
            <h4 class="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Account
            </h4>
            <nav class="flex flex-col gap-3 text-sm text-slate-600">
              <router-link to="/gateway" class="hover:text-slate-900 transition-colors">Orientation</router-link>
              <router-link to="/auth" class="hover:text-slate-900 transition-colors">Sign In</router-link>
            </nav>
          </div>
        </div>
      </div>

      <div class="mt-16 pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-[13px] text-slate-400">
        <div class="space-y-1">
          <div class="font-medium text-slate-500 italic">
            &copy; 2026 MindWorks
          </div>
          <div>
            Created by Robert Ormiston
          </div>
          <div>
            Psychotherapist in Private Practice
          </div>
          <div>
            Member, British Association for Counselling and Psychotherapy (BACP)
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Shared Public Footer
</script>
