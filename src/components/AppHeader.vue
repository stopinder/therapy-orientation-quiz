<template>
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
    <div class="max-w-3xl mx-auto px-6 py-3">
      <div class="flex items-center">

        <!-- Brand -->
        <div class="text-xl font-semibold tracking-tight text-slate-900">

        MindWorks
        </div>


        <!-- Navigation -->
        <nav class="ml-auto flex items-center gap-6 text-base font-medium text-slate-700">


          <router-link
              to="/about"
              class="hover:text-slate-900 transition"
          >
            About
          </router-link>

          <a
              href="https://buy.stripe.com/6oU3cu9hMf8Z6ry1T6c3m04"
              class="hover:text-slate-900 transition text-slate-800"
          >
            ADHD Quiz
          </a>


        </nav>

      </div>
    </div>
  </header>
</template>
