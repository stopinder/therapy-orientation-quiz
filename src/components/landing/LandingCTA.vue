<template>
  <section class="bg-slate-50 px-6 py-20 sm:py-24 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        The first observation takes about two minutes.
      </h2>
      <p class="mt-6 text-lg text-slate-600">
        Begin with one observation. Let the larger picture emerge over time.
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <router-link
          to="/auth"
          class="rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-all"
        >
          Begin
        </router-link>
        <router-link
          to="/about"
          class="text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors"
        >
          About MindWorks <span aria-hidden="true">→</span>
        </router-link>
      </div>
    </div>
  </section>
</template>
