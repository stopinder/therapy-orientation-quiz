<template>
  <section class="bg-white px-6 py-20 sm:py-24 lg:px-8">
    <div class="mx-auto max-w-5xl">
      <div class="text-center">
        <h2 class="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          What becomes visible
        </h2>
        <p class="mt-4 text-lg text-slate-600">
          Through consistent observation, patterns that were once hidden start to emerge.
        </p>
      </div>

      <div class="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="item in visibleItems" :key="item.title" class="flex flex-col rounded-2xl border border-slate-100 bg-slate-50/50 p-8 transition-colors hover:border-slate-200 hover:bg-white">
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
const visibleItems = [
  {
    title: 'Recurring movements',
    description: 'Recognise the familiar sequences of thoughts and actions that tend to play out in similar situations.'
  },
  {
    title: 'Repeated situations',
    description: 'Identify the specific conditions or pressures that consistently precede a particular response.'
  },
  {
    title: 'Changing responses',
    description: 'Observe how your internal states and external behaviours shift as a situation develops.'
  },
  {
    title: 'Emerging continuity',
    description: 'See the thread that connects isolated moments into a recognisable behavioral pattern.'
  }
]
</script>
