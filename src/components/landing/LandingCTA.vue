<template>
  <section class="bg-white py-12">
    <div class="text-center px-4">
      <div class="flex flex-col items-center justify-center">
        <router-link
          to="/gateway"
          class="rounded-full bg-slate-900 px-10 py-4 text-lg font-medium text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-all"
        >
          Begin your investigation
        </router-link>
        <p v-if="showSupport" class="mt-4 text-sm text-slate-500 max-w-sm">
          No diagnosis. No therapy. No advice. Just evidence from your own observations.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  showSupport: {
    type: Boolean,
    default: false
  }
})
</script>
