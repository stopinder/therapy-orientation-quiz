<template>
  <section class="bg-slate-50 px-6 py-20 sm:py-24 lg:px-8">
    <div class="mx-auto max-w-4xl text-center">
      <h2 class="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        How it works
      </h2>
      
      <div class="mt-16 relative flex flex-col items-center sm:flex-row sm:justify-between sm:gap-4">
        <!-- Connecting Line (Desktop) -->
        <div class="absolute top-8 left-0 right-0 hidden h-px bg-slate-200 sm:block"></div>

        <div class="relative flex flex-col items-center flex-1">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm z-10">
            <span class="text-xl font-medium text-slate-900">1</span>
          </div>
          <h3 class="mt-6 text-xl font-semibold text-slate-900">Observe</h3>
          <p class="mt-2 text-sm text-slate-500 max-w-[200px]">Notice one moment.</p>
        </div>

        <div class="h-12 w-px bg-slate-200 my-4 sm:hidden"></div>

        <div class="relative flex flex-col items-center flex-1">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm z-10">
            <span class="text-xl font-medium text-slate-900">2</span>
          </div>
          <h3 class="mt-6 text-xl font-semibold text-slate-900">Accumulate</h3>
          <p class="mt-2 text-sm text-slate-500 max-w-[200px]">Let observations gather.</p>
        </div>

        <div class="h-12 w-px bg-slate-200 my-4 sm:hidden"></div>

        <div class="relative flex flex-col items-center flex-1">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 z-10 shadow-lg shadow-slate-200">
            <span class="text-xl font-medium text-white">3</span>
          </div>
          <h3 class="mt-6 text-xl font-semibold text-slate-900">Recognise</h3>
          <p class="mt-2 text-sm text-slate-500 max-w-[200px]">See what keeps returning.</p>
        </div>
      </div>
    </div>
  </section>
</template>
