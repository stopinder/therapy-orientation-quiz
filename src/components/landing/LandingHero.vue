<template>
  <section class="relative overflow-hidden bg-white px-6 py-20 sm:py-28 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
        Some things only become visible across time.
      </h1>
      <p class="mt-8 text-lg font-medium text-slate-600 sm:text-xl/relaxed">
        MindWorks helps you recognise what keeps returning through repeated observation.
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <router-link
          to="/gateway"
          class="rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-all"
        >
          Begin
        </router-link>
        <router-link
          to="#problem-section"
          class="text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors"
          @click.prevent="scrollToLearnMore"
        >
          Learn More <span aria-hidden="true">→</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
const scrollToLearnMore = () => {
  const element = document.getElementById('problem-section');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>
