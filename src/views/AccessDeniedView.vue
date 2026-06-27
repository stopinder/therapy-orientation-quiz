<template>
  <div class="mx-auto max-w-xl px-6 py-24 text-center">

    <div class="rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">

      <h1 class="mb-4 text-3xl font-semibold">
        Access Restricted
      </h1>

      <p class="mb-8 leading-relaxed text-slate-600">
        You do not currently have access to this course content.
      </p>

      <router-link
          to="/programme"
          class="inline-flex rounded-xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-700"
      >
        View Programme Details
      </router-link>

    </div>

  </div>
</template>