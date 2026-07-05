<template>
  <main class="min-h-screen bg-slate-50 px-6 py-16">

    <!-- Sticky Stage Title -->
    <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
    >
      <div
          v-if="showStickyHeader && week"
          class="fixed inset-x-0 top-14 z-50 flex justify-center px-6 py-4 pointer-events-none"
      >
        <div class="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-md pointer-events-auto">
          Stage {{ week.number }} &middot; {{ week.title }}
        </div>
      </div>
    </transition>

    <div
        v-if="!week"
        class="mx-auto max-w-4xl text-slate-500"
    >
      Stage not found.
    </div>

    <div
        v-else
        class="mx-auto max-w-4xl"
    >

      <div class="mb-12">

        <router-link
            to="/course"
            class="mb-8 inline-flex items-center text-sm text-slate-500 transition hover:text-slate-900"
        >
          Back to Course
        </router-link>

        <p class="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          Stage {{ week.number }}
        </p>

        <h1
            class="text-4xl font-semibold tracking-tight text-slate-950"
        >
          {{ week.title }}
        </h1>

        <div
            v-if="showContinuityBoundary"
            class="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-800"
        >
          Earlier observations are still being processed. Returning to the previous stage may help strengthen recognition of the emerging pattern.
        </div>

      </div>

      <!-- Why You're Here (Orientation Section) -->
      <section
          v-if="week.orientation && ![2, 4, 5].includes(weekNumber)"
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm transition-all duration-300"
      >
        <h2 class="text-2xl font-semibold text-slate-950">
          {{ week.orientation.title }}
        </h2>
        <div class="mt-5 space-y-5 text-base leading-8 text-slate-700">
          <p
              v-for="paragraph in week.orientation.content"
              :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
      </section>

      <!-- Why This Matters (openingReflection or orientation) - Only Stage 2, 3 -->
      <section
          v-if="(week.openingReflection && week.openingReflection.length > 0 && [2, 3].includes(weekNumber))"
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
      >
        <h2 class="text-2xl font-semibold text-slate-950">
          Why This Matters
        </h2>
        <div class="mt-5 space-y-5 text-base leading-8 text-slate-700">
          <p
              v-for="paragraph in week.openingReflection"
              :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
      </section>

      <!-- Why this matters (Orientation content) - Stage 4, 5 -->
      <section
          v-if="[4, 5].includes(weekNumber) && week.orientation"
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
      >
        <h2 class="text-2xl font-semibold text-slate-950">
          Why this matters
        </h2>
        <div class="mt-5 space-y-5 text-base leading-8 text-slate-700">
          <p
              v-for="paragraph in week.orientation.content"
              :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
      </section>

      <!-- This Stage's Experiment (Week 1, 2, 3) -->
      <section
          v-if="[1, 2, 3].includes(week.number)"
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm transition-all duration-300"
      >
        <h2 class="text-2xl font-semibold text-slate-950">
          This Stage's Experiment
        </h2>
        <div v-if="week.number === 1" class="mt-8 space-y-6 text-xl leading-relaxed text-slate-800">
          <p>Before opening email, beginning work, or starting a task:</p>
          <div class="flex flex-col gap-2">
            <p class="font-medium text-2xl text-slate-950">Sense both feet.</p>
            <details class="group">
              <summary class="inline-flex cursor-pointer list-none items-center text-sm font-medium text-slate-500 hover:text-slate-900">
                <span>Why the feet?</span>
                <svg class="ml-1 h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div class="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                This is not a relaxation exercise. It simply gives you a stable reference point before you observe what happens next.
              </div>
            </details>
          </div>
          <p>Ask:</p>
          <p class="font-medium text-2xl text-slate-950">"What am I about to do?"</p>
          <p>Then continue normally.</p>
          <div class="mt-8 pt-6">
            <p class="text-base text-slate-600 italic">Do not try to change anything. Simply notice what happens.</p>
          </div>
        </div>

        <div v-else-if="week.number === 2" class="mt-8 space-y-6 text-xl leading-relaxed text-slate-800">
          <p>Continue to sense both feet before starting a task.</p>
          <p>Add:</p>
          <p class="font-medium text-2xl text-slate-950">Notice what happened just before.</p>
          <p>Then continue normally.</p>
          <div class="mt-8 pt-6">
            <p class="text-base text-slate-600 italic">We are becoming interested in the sequence.</p>
          </div>
        </div>

        <div v-else-if="week.number === 3" class="mt-8 space-y-6 text-xl leading-relaxed text-slate-800">
          <p>Continue to sense both feet (a simple way to pause and notice what’s happening).</p>
          <p>Then, at any point during your day:</p>
          <p>Notice what happens just before you change direction <br><span class="text-base text-slate-600">(for example: delay, check something, scroll, avoid, or switch tasks).</span></p>
          <p>Then ask:</p>
          <p class="font-medium text-2xl text-slate-950">Has this response happened before?</p>
          <p class="text-base text-slate-600">Not the situation. The response itself.</p>
          <p>Then continue normally.</p>
        </div>
      </section>

      <!-- Including the Body (Week 2, 3, 5) -->
      <section
          v-if="[2, 3, 5].includes(weekNumber) && week.bodyFocus"
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
      >
        <h2 class="text-2xl font-semibold text-slate-950">
          Including the Body
        </h2>
        <div class="mt-5 space-y-5 text-base leading-8 text-slate-700">
          <p
              v-for="paragraph in week.bodyFocus"
              :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
      </section>

      <!-- Observation exercises (Week 2, 3, 5) -->
      <section v-if="[2, 3, 5].includes(weekNumber)" class="mb-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <h2 class="text-2xl font-semibold text-slate-950">
          Observation exercises
        </h2>
        <div class="mt-6 grid gap-4">
          <div
              v-for="exercise in week.exercises"
              :key="exercise.title"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <h3 class="font-medium text-slate-950">
              {{ exercise.title }}
            </h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              {{ exercise.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- Reflect with MindWorks -->
      <section
          id="reflect-with-mindworks"
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm transition-all duration-300"
      >

        <div class="mb-8 flex items-center justify-between">

          <h2 class="text-2xl font-semibold text-slate-950">
            Reflect with MindWorks
          </h2>

          <div
              v-if="weekCompleted && (![1, 2, 3].includes(weekNumber) || hasGeneratedReflectionThisSession)"
              class="rounded-full bg-emerald-100 px-4 py-2 text-xs font-medium text-emerald-700"
          >
            Reflection completed
          </div>

        </div>

        <div
            v-if="week.number === 1"
            class="mb-10 rounded-2xl border border-slate-200 bg-slate-50/50 p-8"
        >
          <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Stage 1 Arrival
          </h3>
          <p class="text-base leading-7 text-slate-700">
            Here, we are becoming interested in the moment where continuity changes.
            Before you begin your reflection, take a moment to settle.
            Notice the transition from whatever you were doing before to this moment here.
          </p>
        </div>

        <div class="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1">
            <p
                class="text-base leading-7 text-slate-600"
            >
              {{ week.reflectionPrompt }}
            </p>
          </div>
          <VoiceRecorder @transcribed="text => reflection += (reflection ? ' ' : '') + text" />
        </div>

        <textarea
            v-model="reflection"
            rows="8"
            class="mt-6 w-full rounded-2xl border border-slate-300 bg-white p-4 text-base leading-7 text-slate-800 outline-none transition focus:border-slate-900"
            :placeholder="reflectionPlaceholder"
        />

        <div class="mt-8">
          <div class="flex items-center justify-between">
            <p class="text-base font-medium text-slate-900">
              Optional body note
            </p>
            <VoiceRecorder @transcribed="appendBodyObservationTranscription" />
          </div>
          <p class="mt-1 text-sm text-slate-500">
            If you noticed a sensation in the body, you can add it here.
          </p>
          <textarea
              v-model="bodyObservation"
              rows="4"
              class="mt-4 w-full rounded-2xl border border-slate-300 bg-white p-4 text-base leading-7 text-slate-800 outline-none transition focus:border-slate-900"
              :placeholder="bodyObservationPlaceholder"
          />
        </div>

        <div class="mt-5 flex items-center gap-4">
          <button
              type="button"
              :disabled="loading || !reflection.trim()"
              @click="submitReflection"
              class="rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {{ loading ? "Reflecting..." : "Generate reflection" }}
          </button>

          <Transition
              enter-active-class="transition duration-500 ease-out"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition duration-500 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
              mode="out-in"
          >
            <p v-if="loading" :key="currentLoadingMessage" class="text-sm font-medium text-slate-500 italic animate-pulse">
              {{ currentLoadingMessage }}
            </p>
          </Transition>
        </div>

        <div
            v-if="error"
            class="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700"
        >
          {{ error }}
        </div>

        <!-- Reflection Output -->
        <div
            v-if="response && (![1, 2, 3].includes(weekNumber) || hasGeneratedReflectionThisSession)"
            class="mt-12 space-y-8"
        >
          <div
              v-for="(section, idx) in parsedResponse"
              :key="idx"
              class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <h3 v-if="section.title" class="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              {{ section.title }}
            </h3>

            <div
                class="whitespace-pre-line text-lg leading-relaxed text-slate-700"
            >
              <template v-if="section.title === 'Questions to stay with'">
                <ul class="space-y-4">
                  <li
                      v-for="(q, qIdx) in section.content.split('\n').map(l => l.trim()).filter(l => l && !/^[-*•]$/.test(l))"
                      :key="qIdx"
                      class="flex gap-3"
                  >
                    <span class="text-slate-400">•</span>
                    <span>{{ q.replace(/^[-*•]\s*/, '') }}</span>
                  </li>
                </ul>
              </template>
              <template v-else>
                {{ section.content }}
              </template>
            </div>
          </div>
        </div>

      </section>

      <!-- What These Moments May Have In Common (Stage 3+) -->
      <section
          v-if="showPatternBlock && currentStageReflections.length >= 1 && (![1, 2, 3].includes(weekNumber) || hasGeneratedReflectionThisSession) && weekNumber !== 3"
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
      >
        <p class="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          {{ patternBlockLabel }}
        </p>

        <template v-if="currentStageReflections.length < 3">
          <p class="text-base text-slate-600 leading-relaxed">
            MindWorks is collecting observations for this stage. Patterns become visible through repetition.
          </p>
        </template>
        <template v-else-if="currentStageReflections.length >= 3">
          <p class="mb-4 text-sm text-slate-500">
            {{ discoveryWording }}
          </p>

          <ul class="mb-8 space-y-3">
            <li
                v-for="(item, index) in currentStageReflections.slice(0, 3)"
                :key="item.id || index"
                class="text-base text-slate-700 flex gap-3"
            >
              <span class="text-slate-400">•</span>
              <span>{{ item.original_reflection }}</span>
            </li>
          </ul>

          <div class="border-t border-slate-100 pt-6">
            <p class="mb-2 text-sm font-medium uppercase tracking-wider text-slate-500">
              {{ patternTypeLabel }}
            </p>
            <p class="text-lg font-medium text-slate-900">
              {{ stagePrimaryContent }}
            </p>
          </div>
        </template>
      </section>

      <!-- Phase 1 Sequence Surface Prototype -->
      <section
          v-if="showSequenceBlock && ![2, 5].includes(weekNumber)"
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
      >
        <p class="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          {{ sequenceBlockLabel }}
        </p>
        <p class="mb-6 text-base text-slate-600">
          {{ sequenceBlockWording }}
        </p>

        <div class="mt-8 inline-flex flex-col items-start gap-3">
          <template v-for="(step, index) in sequenceSteps" :key="index">
            <div class="flex h-10 items-center justify-center rounded-xl bg-slate-50 px-5 py-2 border border-slate-200">
              <span class="text-base font-medium text-slate-900">{{ step }}</span>
            </div>

            <div v-if="index < sequenceSteps.length - 1" class="flex w-full justify-center py-0.5 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </div>
          </template>
        </div>

        <div v-if="weekNumber === 3" class="mt-4 space-y-4">
          <p class="text-sm text-slate-600">
            (for example: checking, scrolling, delaying, cancelling, withdrawing, or reorganising)
          </p>
          <p class="text-sm text-slate-500 italic">
            This is an early pattern. It is starting to show as more observations are made.
          </p>
        </div>
      </section>

      <!-- Recent Reflections -->
      <section
          v-if="currentStageReflections.length > 0 && (weekNumber === 1 ? currentStageReflections.length >= 3 : true) && (![1, 2, 3].includes(weekNumber) || hasGeneratedReflectionThisSession)"
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
      >
        <h3 class="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Recent Reflections
        </h3>
        <div class="space-y-6">
          <div
              v-for="item in currentStageReflections.slice(0, 3)"
              :key="item.id"
              class="rounded-2xl border border-slate-100 bg-slate-50/50 p-6"
          >
            <div class="mb-2 text-xs font-medium text-slate-400">
              {{ new Date(item.created_at).toLocaleDateString() }}
            </div>
            <p class="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
              {{ item.original_reflection }}
            </p>
          </div>
        </div>
      </section>

      <!-- Sequence Becoming Visible (Stage 2 Specific) -->
      <section
          v-if="weekNumber === 2 && hasGeneratedReflectionThisSession"
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
      >
        <p class="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          Sequence Becoming Visible
        </p>
        <p class="mb-6 text-base text-slate-600">
          As you begin to map the order of events, the movement from intention to response becomes more visible.
        </p>

        <div class="border-t border-slate-100 pt-6 mt-8">
          <p class="mb-4 text-sm font-medium uppercase tracking-wider text-slate-500">
            Current Sequence
          </p>
        </div>

        <div class="mt-8 inline-flex flex-col items-start gap-3">
          <template v-for="(step, index) in ['Intention', 'Internal Shift', 'Response']" :key="index">
            <div class="flex h-10 items-center justify-center rounded-xl bg-slate-50 px-5 py-2 border border-slate-200">
              <span class="text-base font-medium text-slate-900">{{ step }}</span>
            </div>

            <div v-if="index < 2" class="flex w-full justify-center py-0.5 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </div>
          </template>
        </div>
      </section>

      <!-- Initial Observation Profile (from Quiz) -->
      <section
          v-if="quizProfileSummary && reflectionsHistory.length >= 1 && (![1, 2, 3].includes(weekNumber) || hasGeneratedReflectionThisSession)"
          class="mb-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
      >
        <p class="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          {{ weekNumber === 1 ? 'Initial Observation Profile' : 'Emerging Pattern' }}
        </p>
        <div class="text-base leading-8 text-slate-700 whitespace-pre-line">
          {{ quizProfileSummary }}
        </div>
      </section>

      <!-- Read More Accordion for Stage 1-5 (Why This Matters) -->
      <section v-if="![6, 2, 1, 3, 4, 5].includes(weekNumber)" class="mb-10">
        <button
            @click="showReadMore = !showReadMore"
            class="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-white p-10 shadow-sm transition hover:bg-slate-50"
        >
          <span class="text-xl font-semibold text-slate-950">Why This Matters</span>
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-slate-400 transition-transform duration-200"
              :class="{ 'rotate-180': showReadMore }"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div
            v-if="showReadMore"
            class="mt-4 space-y-4"
        >
          <div class="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <h2 class="text-2xl font-semibold text-slate-950">
              Opening reflection
            </h2>
            <div class="mt-5 space-y-5 text-base leading-8 text-slate-700">
              <p
                  v-for="paragraph in week.openingReflection"
                  :key="paragraph"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>

          <div
              v-if="week.bodyFocus"
              class="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
          >
            <h2 class="text-2xl font-semibold text-slate-950">
              Including the Body
            </h2>
            <div class="mt-5 space-y-5 text-base leading-8 text-slate-700">
              <p
                  v-for="paragraph in week.bodyFocus"
                  :key="paragraph"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>

          <div class="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
            <h2 class="text-2xl font-semibold text-slate-950">
              Observation exercises
            </h2>
            <div class="mt-6 grid gap-4">
              <div
                  v-for="exercise in week.exercises"
                  :key="exercise.title"
                  class="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 class="font-medium text-slate-950">
                  {{ exercise.title }}
                </h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  {{ exercise.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stage 6 specific expanded content (relegated to bottom or kept if preferred) -->
      <template v-if="weekNumber === 6">
        <section class="mb-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <h2 class="text-2xl font-semibold text-slate-950">
            Why This Matters
          </h2>
          <div class="mt-5 space-y-5 text-base leading-8 text-slate-700">
            <p
                v-for="paragraph in week.openingReflection"
                :key="paragraph"
            >
              {{ paragraph }}
            </p>
          </div>
        </section>

        <section
            v-if="week.bodyFocus"
            class="mb-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
        >
          <h2 class="text-2xl font-semibold text-slate-950">
            Including the Body
          </h2>
          <div class="mt-5 space-y-5 text-base leading-8 text-slate-700">
            <p
                v-for="paragraph in week.bodyFocus"
                :key="paragraph"
            >
              {{ paragraph }}
            </p>
          </div>
        </section>

        <section class="mb-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <h2 class="text-2xl font-semibold text-slate-950">
            Observation exercises
          </h2>
          <div class="mt-6 grid gap-4">
            <div
                v-for="exercise in week.exercises"
                :key="exercise.title"
                class="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <h3 class="font-medium text-slate-950">
                {{ exercise.title }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                {{ exercise.description }}
              </p>
            </div>
          </div>
        </section>
      </template>

    </div>

  </main>
</template>

<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch
} from "vue"

import { useRoute }
  from "vue-router"

import { courseWeeks }
  from "../data/courseWeeks"

import { useAuthStore }
  from "../stores/auth"

import { useCourseProgressStore }
  from "../stores/courseProgress"

import { useContinuity }
  from "../composables/useContinuity"

import { supabase }
  from "../lib/supabase"

import VoiceRecorder from "../components/VoiceRecorder.vue"

const route = useRoute()

const auth = useAuthStore()

const courseProgress =
    useCourseProgressStore()

const {
  isFutureBoundary
} = useContinuity()

const reflection = ref("")
const bodyObservation = ref("")
const response = ref("")
const loading = ref(false)
const error = ref("")

const hasGeneratedReflectionThisSession = ref(false)

const reflectionPlaceholder = computed(() => {
  if (weekNumber.value === 1) return "I intended to start work, but I checked messages instead..."
  if (weekNumber.value === 2) return "I was about to make a call, but I looked at the phone and then opened email..."
  if (weekNumber.value === 3) return "What specifically repeated?"
  if (weekNumber.value === 6) return "For example: During a difficult conversation, I wanted to leave, then tried to explain myself, and later became quiet."
  return "Describe what happened..."
})

const bodyObservationPlaceholder = "Tension, restlessness, heaviness, or leave blank..."

const restoredReflection =
    ref(false)

const loadingMessages = computed(() => {
  const generic = [
    "Reviewing your recent observations...",
    "Looking for what is relevant to this stage...",
    "Placing observations beside one another...",
    "Preparing what is becoming visible..."
  ]

  const stageMessages = {
    2: [
      "Looking for the order of events...",
      "Noticing what came before the shift..."
    ],
    3: [
      "Comparing this stage with earlier observations...",
      "Looking for recurrence..."
    ],
    4: [
      "Looking for conditions that appeared beforehand...",
      "Noticing recurring states..."
    ],
    5: [
      "Looking at what changed afterwards...",
      "Noticing what remained or shifted..."
    ],
    6: [
      "Looking across the whole pattern...",
      "Noticing how responses may fit together..."
    ]
  }

  return stageMessages[weekNumber.value] || generic
})

const currentLoadingMessage = ref("")
let loadingInterval = null

const startLoadingRotation = () => {
  let index = 0
  const messages = loadingMessages.value
  currentLoadingMessage.value = messages[0]
  loadingInterval = setInterval(() => {
    index = (index + 1) % messages.length
    currentLoadingMessage.value = messages[index]
  }, 1500)
}

const stopLoadingRotation = () => {
  if (loadingInterval) {
    clearInterval(loadingInterval)
    loadingInterval = null
  }
}

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  stopLoadingRotation()
})

const quizProfileSummary =
    ref("")

const appendBodyObservationTranscription = (text) => {
  bodyObservation.value = bodyObservation.value
      ? `${bodyObservation.value}\n\n${text}`
      : text
}

const showReadMore = ref(false)

const parsedResponse = computed(() => {
  if (!response.value) return []
  
  const sections = []
  const lines = response.value.split('\n')
  let currentSection = null

  lines.forEach(line => {
    const headingMatch = line.match(/^###\s+(.*)/)
    if (headingMatch) {
      if (currentSection) sections.push(currentSection)
      currentSection = {
        title: headingMatch[1].trim(),
        content: []
      }
    } else if (line.trim() || (currentSection && currentSection.content.length > 0)) {
      if (currentSection) {
        currentSection.content.push(line)
      } else if (line.trim()) {
        // Handle cases where there might be text before the first heading
        currentSection = {
          title: "",
          content: [line]
        }
      }
    }
  })

  if (currentSection) sections.push(currentSection)

  return sections.map(s => ({
    ...s,
    content: s.content.join('\n').trim()
  }))
})

const reflectionsHistory = ref([])

const currentStageReflections = computed(() => {
  return reflectionsHistory.value.filter(r => r.week_number === weekNumber.value)
})

const BEHAVIORAL_MAP = {
  'Something else repeatedly happens before beginning.': ['preparing', 'prepare', 'preparation', 'reorganised', 'reorganized', 'reorganise', 'reorganize', 'desk', 'notes', 'organising', 'organizing', 'planning', 'research', 'tidying'],
  'Attention drifts to digital tools or rituals before starting.': ['email', 'messages', 'messaging', 'scrolling', 'tea', 'coffee', 'before starting', 'before beginning', 'before making', 'before joining'],
  'Delay occurs immediately after an intention is formed.': ['delay', 'delayed', 'hesitation', 'hesitant', 'postponed', 'postponing'],
  'A verification ritual repeatedly precedes action.': ['checking', 'checked', 'rechecked', 'monitoring']
}

const recentThemes = computed(() => {
  if (!currentStageReflections.value || currentStageReflections.value.length === 0) return []

  const latestThree = currentStageReflections.value.slice(0, 3)
  const categoryData = {}

  latestThree.forEach(item => {
    const text = (item.original_reflection || '').toLowerCase()
    const seenInThisReflection = new Set()

    Object.entries(BEHAVIORAL_MAP).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          seenInThisReflection.add(category)
        }
      })
    })

    seenInThisReflection.forEach(category => {
      if (!categoryData[category]) {
        categoryData[category] = {
          count: 0,
          examples: []
        }
      }
      categoryData[category].count += 1
      if (categoryData[category].examples.length < 3) {
        categoryData[category].examples.push(item.original_reflection)
      }
    })
  })

  return Object.entries(categoryData)
      .map(([category, data]) => ({
        name: category,
        count: data.count,
        examples: data.examples
      }))
      .sort((a, b) => b.count - a.count)
})

const topPattern = computed(() => {
  return recentThemes.value.length > 0 ? recentThemes.value[0] : null
})

const uniqueObservations = computed(() => {
  const allExamples = []
  recentThemes.value.forEach(theme => {
    theme.examples.forEach(example => {
      if (!allExamples.includes(example)) {
        allExamples.push(example)
      }
    })
  })
  return allExamples
})

const showPatternBlock = computed(() => {
  const count = currentStageReflections.value.length
  if (count < 1) return false
  
  // For Stage 2, always show the block if there is at least 1 reflection
  // (Either shows the "collecting" message or the full pattern)
  if (weekNumber.value === 2) return true

  if (count === 1) return false
  if (count === 2) return true

  // For 3+ reflections
  if (weekNumber.value === 1) {
    return !!topPattern.value
  }

  return topPattern.value && topPattern.value.examples.length >= 2
})

const showSequenceBlock = computed(() => {
  const count = currentStageReflections.value.length

  if (count < 3) return false

  if (weekNumber.value === 2) return hasGeneratedReflectionThisSession.value
  return (weekNumber.value >= 2 && topPattern.value && topPattern.value.examples.length >= 2) || (weekNumber.value === 3 && hasGeneratedReflectionThisSession.value)
})

const patternBlockLabel = computed(() => {
  const n = weekNumber.value
  if (n === 3) return "What These Moments May Have In Common"
  if (n === 4) return "State Becoming Visible"
  if (n === 5) return "What happened next"
  if (n === 6) return "What Keeps Appearing Around Pressure"
  return "What MindWorks Is Noticing"
})

const patternTypeLabel = computed(() => {
  const n = weekNumber.value
  if (n === 3) return "Emerging Pattern"
  if (n === 4) return "Primary State"
  if (n === 5) return "Consequence"
  if (n === 6) return "What These Responses May Have In Common"
  return "Possible Pattern"
})

const discoveryWording = computed(() => {
  const n = weekNumber.value
  if (n === 2) return "Across recent Stage 2 observations:"
  if (n === 3) return "Across recent reflections, a recurring structure is beginning to appear."
  if (n === 4) return "MindWorks is noticing the emotional climate and internal conditions that tend to precede this sequence: pressure, uncertainty, body context, or exposure."
  if (n === 5) return "MindWorks is beginning to notice what changes after a familiar response appears, without needing to explain why."
  if (n === 6) return "MindWorks is beginning to observe whether several different responses gather around similar conditions."
  return "Across recent reflections:"
})

const stagePrimaryContent = computed(() => {
  const n = weekNumber.value
  if (n === 2) return "An intention is followed by a body signal or pressure, then by a movement away from the original task."
  if (n === 3) return "Across these observations, different situations seem to share a similar movement: an intention or point of engagement appears, pressure or uncertainty follows, and then there is a shift in direction."
  if (n === 4) return "Pressure or uncertainty appears before checking, preparing, or delay."
  if (n === 5) return "A familiar movement coincides with a shift in internal pressure, a change in attention, or a postponement."
  if (n === 6) return "Checking, preparing, delaying, or reorganising may look different on the surface. Yet they appear around the same pressure. It is not yet clear whether they are trying to accomplish something similar."
  return topPattern.value?.name || ""
})

const sequenceBlockLabel = computed(() => {
  const n = weekNumber.value
  if (n === 2) return "Sequence Becoming Visible"
  return "Most Common Sequence"
})

const sequenceBlockWording = computed(() => {
  const n = weekNumber.value
  if (n === 2) return "MindWorks is beginning to place events in order."
  return "A possible sequence appearing across your recent reflections."
})

const sequenceSteps = computed(() => {
  const n = weekNumber.value
  if (n === 6) {
    return [
      "Pressure / Uncertainty",
      "Response A",
      "Response B",
      "Relationship is still being observed"
    ]
  }
  if (n === 3) {
    return [
      "Engagement / intention",
      "Pressure or uncertainty",
      "Attention moves elsewhere"
    ]
  }
  if (n >= 4) {
    return [
      "Pressure / Uncertainty",
      "Checking / Preparing",
      "Delay"
    ]
  }
  return [
    "Intention",
    "Checking / Preparing",
    "Delay"
  ]
})

const inferSituation = (item) => {
  const text = item.original_reflection.toLowerCase()
  if (text.includes('lesson') || text.includes('teacher') || text.includes('school')) return 'learning / authority'
  if (text.includes('meeting') || text.includes('work') || text.includes('task')) return 'exposure / pressure'
  if (text.includes('relationship') || text.includes('conversation') || text.includes('closeness') || text.includes('conflict')) return 'closeness / conflict'
  return 'Not yet clear'
}

const inferAppeared = (item) => {
  const text = item.original_reflection.toLowerCase()
  if (text.includes('reminded me of school')) return 'reminder of school / difficulty staying engaged'
  if (text.includes('fear') || text.includes('freezing')) return 'fear of freezing'
  if (text.includes('leave') && text.includes('closeness')) return 'wanting to leave and wanting closeness'
  return 'Not yet clear'
}

const inferResponse = (item) => {
  const text = item.original_reflection.toLowerCase()
  if (text.includes('did not go back') || text.includes('did not return')) return 'did not return'
  if (text.includes('checked messages') || text.includes('reorganised')) return 'checked messages, reorganised notes, delayed joining'
  if (text.includes('internal pull')) return 'internal pull in opposite directions'
  return 'Not yet clear'
}

const fetchReflectionsHistory = async () => {
  try {
    if (!auth.user?.id) return

    const result = await fetch("/api/getReflectionHistory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: auth.user.id })
    })

    const data = await result.json()
    
    console.log("REFLECTIONS RECEIVED FROM API:", data?.reflections?.length || 0)
    
    if (data?.reflections) {
      reflectionsHistory.value = Array.isArray(data.reflections)
          ? data.reflections
          : []
          
      console.log("REFLECTIONS ASSIGNED TO HISTORY:", reflectionsHistory.value.length)
      console.log("COMPUTED RECENT THEMES:", JSON.stringify(recentThemes.value, null, 2))
    }
  } catch (err) {
    console.error("HISTORY ERROR:", err)
  }
}

const fetchQuizProfile =
    async () => {

      if (!auth.user?.email) {
        return
      }

      const { data } = await supabase
          .from("quiz_submissions")
          .select("quiz_profile_summary")
          .eq("email", auth.user.email)
          .maybeSingle()

      if (data) {
        quizProfileSummary.value =
            data.quiz_profile_summary
      }

    }

const weekNumber = computed(() =>
    Number(route.params.weekNumber)
)

const week = computed(() =>
    courseWeeks.find(
        (item) =>
            item.number ===
            weekNumber.value
    )
)

const weekCompleted =
    computed(() =>
        courseProgress.isWeekCompleted(
            weekNumber.value
        )
    )

const showContinuityBoundary =
    computed(() => {

      return isFutureBoundary(
          weekNumber.value
      )

    })

const restorePreviousReflection =
    async () => {

      try {

        if (!auth.user?.id) {
          return
        }

        const result = await fetch(
            "/api/getCourseReflection",
            {
              method: "POST",

              headers: {
                "Content-Type":
                    "application/json"
              },

              body: JSON.stringify({

                userId:
                auth.user.id,

                week:
                weekNumber.value

              })
            }
        )

        const data =
            await result.json()

        if (
            data?.reflection
        ) {

          // reflection.value =
          //     data.reflection
          //         .original_reflection || ""

          response.value =
              data.reflection
                  .ai_response || ""

          restoredReflection.value =
              true

        }

      } catch (err) {

        console.error(
            "RESTORE ERROR:",
            err
        )

      }

    }

const showStickyHeader = ref(false)

const handleScroll = () => {
  showStickyHeader.value = window.scrollY > 150
}

onMounted(async () => {

  window.addEventListener('scroll', handleScroll)

  if (
      auth.user?.id &&
      weekNumber.value
  ) {

    await courseProgress.markWeekStarted(
        auth.user.id,
        weekNumber.value,
        "week-entry"
    )

    await fetchQuizProfile()

    await restorePreviousReflection()

    await fetchReflectionsHistory()

  }

})

const submitReflection = async () => {

  error.value = ""

  // Quality Gate
  const content = reflection.value.trim().toLowerCase()
  const gibberish = ['asdf', 'sdfadg', 'qwerty', 'zxcv', 'jkl;']
  const hasGibberish = gibberish.some(pattern => content.includes(pattern))

  if (content.length < 20 || !content.includes(' ') || hasGibberish) {
    error.value = "Please describe the experience in a little more detail before generating a reflection."
    return
  }

  response.value = ""
  loading.value = true
  startLoadingRotation()

  try {

    if (!auth.user?.id) {

      throw new Error(
          "User not authenticated"
      )

    }

    const result = await fetch(
        "/api/courseReflection",
        {
          method: "POST",

          headers: {
            "Content-Type":
                "application/json"
          },

          body: JSON.stringify({

            week:
            weekNumber.value,

            reflection:
            reflection.value,

            bodyObservation:
            bodyObservation.value,

            userId:
            auth.user.id,

            email:
            auth.user.email

          })
        }
    )

    const text =
        await result.text()

    let data = {}

    try {

      data = text
          ? JSON.parse(text)
          : {}

    } catch {

      throw new Error(
          "Invalid server response"
      )

    }

    if (!result.ok) {

      throw new Error(
          data.error ||
          "Reflection generation failed."
      )

    }

    response.value =
        data.reflection || ""

    hasGeneratedReflectionThisSession.value = true

    reflection.value = ""
    bodyObservation.value = ""

    await courseProgress
        .markWeekCompleted(
            auth.user.id,
            weekNumber.value
        )

    await fetchReflectionsHistory()

  } catch (err) {

    error.value =
        err.message ||
        "Something went wrong."

  } finally {

    loading.value = false
    stopLoadingRotation()

  }
}
</script>
