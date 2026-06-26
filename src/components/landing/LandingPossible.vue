<template>
  <section class="bg-white px-6 py-20 sm:py-24 lg:px-8">
    <div class="mx-auto max-w-5xl">
      <div class="text-center">
        <h2 class="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          What becomes possible
        </h2>
      </div>

      <div class="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="item in possibleItems" :key="item.title" class="flex flex-col rounded-2xl border border-slate-100 bg-slate-50/50 p-8 transition-colors hover:border-slate-200 hover:bg-white shadow-sm">
          <h3 class="text-lg font-semibold text-slate-900 leading-tight">{{ item.title }}</h3>
          <p class="mt-4 text-sm/relaxed text-slate-600">
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const possibleItems = [
  {
    title: 'Clarity',
    description: 'You begin to see the pattern rather than only being inside it.'
  },
  {
    title: 'Steadiness',
    description: 'Repeated responses become easier to recognise as they appear.'
  },
  {
    title: 'Choice',
    description: 'You may notice small spaces where a different response becomes possible.'
  },
  {
    title: 'Preparedness',
    description: 'By Stage 6, repeated responses can begin to be seen in relation to one another.'
  }
]
</script>
