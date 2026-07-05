<template>
  <footer class="bg-white border-t border-slate-100 pt-10 pb-12 px-6">
    <div class="mx-auto max-w-5xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-left">
        <!-- Column 1: Brand -->
        <div class="space-y-2">
          <div class="text-lg font-semibold tracking-tight text-slate-900">
            MindWorks
          </div>
          <p class="text-[13px] leading-snug text-slate-500 max-w-xs">
            Recognising patterns across time.
          </p>
        </div>

        <!-- Column 2: Navigation -->
        <div class="space-y-3">
          <h4 class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </h4>
          <nav class="flex flex-col gap-2 text-[13px] leading-tight text-slate-600">
            <router-link to="/" class="hover:text-slate-900 transition-colors">Home</router-link>
            <router-link to="/about" class="hover:text-slate-900 transition-colors">About</router-link>
            <router-link to="/contact" class="hover:text-slate-900 transition-colors">Contact</router-link>
            <a href="https://therapyworks.works" target="_blank" rel="noopener" class="hover:text-slate-900 transition-colors">TherapyWorks</a>
          </nav>
        </div>

        <!-- Column 3: Legal -->
        <div class="space-y-3">
          <h4 class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Legal
          </h4>
          <nav class="flex flex-col gap-2 text-[13px] leading-tight text-slate-600">
            <router-link to="/privacy" class="hover:text-slate-900 transition-colors">Privacy Policy</router-link>
            <router-link to="/terms" class="hover:text-slate-900 transition-colors">Terms & Conditions</router-link>
          </nav>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 pt-4 border-t border-slate-50 text-[12px] text-slate-400">
        © 2026 MindWorks — Robert Ormiston, Psychotherapist (BACP)
      </div>
    </div>
  </footer>
</template>

<script setup>
// Shared Public Footer
</script>
