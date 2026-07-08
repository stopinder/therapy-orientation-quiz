<template>
  <div class="min-h-screen bg-[#FDFCF7] text-[#333333] font-sans selection:bg-[#E8E4D8]">
    <!-- Header -->
    <header class="p-6 md:p-8 flex justify-between items-center max-w-4xl mx-auto w-full">
      <div class="text-xl font-medium tracking-tight text-[#111111]">MindWorks</div>
      <button 
        v-if="!isConfirmation"
        @click="confirmExit"
        class="text-sm text-[#666666] hover:text-[#333333] transition-colors"
      >
        Exit
      </button>
    </header>

    <main class="max-w-2xl mx-auto px-6 py-12 md:py-20">
      <transition name="fade" mode="out-in">
        <!-- Interview Intro -->
        <div v-if="!isStarted && !isConfirmation" key="intro" class="text-center md:text-left">
          <header class="mb-10">
            <h1 class="text-3xl md:text-4xl font-medium mb-6">
              First Investigation Example
            </h1>
            <div class="text-lg text-[#333333] space-y-4 mb-10">
              <p>We’ll start with one recent situation.</p>
              <p>You don’t need to explain it yet.</p>
              <p>Just describe what happened, step by step.</p>
              <p>MindWorks will use this example to begin looking for patterns across repeated situations.</p>
            </div>
            <button
              @click="isStarted = true"
              class="bg-[#111111] text-white px-8 py-4 rounded-full hover:bg-[#333333] transition-all font-medium inline-flex items-center gap-2 shadow-sm"
            >
              Begin Interview
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </header>
        </div>

        <!-- Interview Steps -->
        <div v-else-if="!isConfirmation" :key="currentStep">
          <div class="mb-12">
            <div class="flex gap-1 mb-6">
              <div 
                v-for="n in totalSteps" 
                :key="n"
                class="h-1 flex-1 rounded-full transition-colors duration-500"
                :class="n <= currentStep ? 'bg-[#111111]' : 'bg-[#E8E4D8]'"
              ></div>
            </div>
            <h1 class="text-2xl md:text-3xl font-light leading-tight text-[#111111] mb-2">
              {{ questions[currentStep - 1].text }}
            </h1>
            <p v-if="questions[currentStep - 1].subtext" class="text-[#666666] text-sm">
              {{ questions[currentStep - 1].subtext }}
            </p>
          </div>

          <div class="mb-12">
            <template v-if="questions[currentStep - 1].type === 'radio'">
              <div class="space-y-3">
                <label
                  v-for="option in questions[currentStep - 1].options"
                  :key="option.value"
                  class="flex cursor-pointer items-center gap-4 rounded-xl border border-[#D1CDC2] px-6 py-4 transition hover:bg-[#F3F1EA]"
                  :class="answers[currentStep - 1] === option.value ? 'bg-[#111111] text-white border-[#111111]' : 'bg-transparent text-[#333333]'"
                >
                  <input
                    type="radio"
                    :name="'step-' + currentStep"
                    :value="option.value"
                    v-model="answers[currentStep - 1]"
                    class="h-5 w-5 accent-[#111111]"
                  />
                  <span class="text-lg">{{ option.label }}</span>
                </label>
              </div>
            </template>
            <template v-else>
              <textarea
                v-model="answers[currentStep - 1]"
                class="w-full bg-transparent border-b border-[#D1CDC2] py-4 text-xl focus:outline-none focus:border-[#111111] transition-colors placeholder:text-[#D1CDC2] resize-none overflow-hidden"
                rows="1"
                ref="textarea"
                @input="adjustTextareaHeight"
                placeholder="Your answer..."
                autofocus
              ></textarea>
            </template>
          </div>

          <div class="flex justify-between items-center">
            <button
              v-if="currentStep > 1"
              @click="prevStep"
              class="text-[#666666] hover:text-[#111111] transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back
            </button>
            <div v-else></div>

            <button
              @click="nextStep"
              :disabled="!answers[currentStep - 1]?.trim()"
              class="bg-[#111111] text-white px-8 py-3 rounded-full hover:bg-[#333333] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
            >
              {{ currentStep === totalSteps ? 'Complete' : 'Continue' }}
              <svg v-if="currentStep < totalSteps" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <!-- Confirmation Screen -->
        <div v-else key="confirmation" class="text-center md:text-left">
          <div class="mb-12">
            <h1 class="text-3xl md:text-4xl font-light leading-tight text-[#111111] mb-6">
              First example added
            </h1>
            <p class="text-lg text-[#333333] mb-8 leading-relaxed">
              MindWorks has captured one sequence:
            </p>
            
            <ul class="space-y-3 mb-12 text-[#111111] font-medium text-lg italic opacity-80">
              <li>what you were doing</li>
              <li>what interrupted it</li>
              <li>what happened next</li>
              <li>whether you returned</li>
              <li>what was different afterwards</li>
            </ul>

            <div class="space-y-6 text-lg text-[#333333] leading-relaxed max-w-xl">
              <p>One example doesn’t prove a pattern.</p>
              <p>But it gives the investigation something real to compare against.</p>
            </div>
          </div>

          <div class="flex flex-col md:flex-row gap-4 pt-8 border-t border-[#E8E4D8]">
            <button 
              @click="viewFirstSnapshot"
              class="bg-[#111111] text-white px-8 py-4 rounded-full hover:bg-[#333333] transition-all font-medium text-center"
            >
              View First Snapshot
            </button>
            <button 
              @click="addAnotherExample"
              class="border border-[#D1CDC2] text-[#111111] px-8 py-4 rounded-full hover:bg-[#F3F1EA] transition-all font-medium text-center"
            >
              Add Another Example
            </button>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const currentStep = ref(1)
const totalSteps = 7
const isStarted = ref(false)
const isConfirmation = ref(false)
const textarea = ref(null)

const questions = [
  { text: "What were you doing when the interruption happened?", subtext: "" },
  { text: "What interrupted you?", subtext: "" },
  { text: "What happened immediately afterwards?", subtext: "" },
  { text: "What did you do next?", subtext: "" },
  { 
    text: "Did you return to the original task?", 
    subtext: "",
    type: "radio",
    options: [
      { label: "Yes, quite soon.", value: "soon" },
      { label: "Yes, but later than intended.", value: "later" },
      { label: "No, I moved on to something else.", value: "no_moved_on" },
      { label: "No, it stayed unfinished.", value: "no_unfinished" },
      { label: "I’m not sure.", value: "unsure" }
    ]
  },
  { 
    text: "What made it harder to return?", 
    subtext: "If relevant:",
    type: "radio",
    options: [
      { label: "I lost my place.", value: "lost_place" },
      { label: "The task felt heavier.", value: "heavier" },
      { label: "Something else became more urgent.", value: "urgent" },
      { label: "I forgot about it.", value: "forgot" },
      { label: "I avoided going back to it.", value: "avoided" },
      { label: "I was still thinking about the interruption.", value: "thinking_about_interruption" },
      { label: "I’m not sure.", value: "unsure" }
    ]
  },
  { text: "What was left different afterwards?", subtext: "" }
]

const answers = ref(Array(totalSteps).fill(""))

const adjustTextareaHeight = () => {
  if (textarea.value && Array.isArray(textarea.value)) {
    const el = textarea.value[0]
    if (el) {
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
    }
  } else if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  }
}

const nextStep = () => {
  if (currentStep.value === 5) {
    const q5Answer = answers.value[4]
    if (q5Answer === 'soon') {
      // Skip Q6
      answers.value[5] = "" // Clear Q6 if skipped
      currentStep.value = 7
      nextTick(() => {
        adjustTextareaHeight()
        textarea.value?.focus()
      })
      return
    }
  }

  if (currentStep.value < totalSteps) {
    currentStep.value++
    nextTick(() => {
      adjustTextareaHeight()
      textarea.value?.focus()
    })
  } else {
    completeInterview()
  }
}

const prevStep = () => {
  if (currentStep.value === 7) {
    const q5Answer = answers.value[4]
    if (q5Answer === 'soon') {
      currentStep.value = 5
      nextTick(() => {
        adjustTextareaHeight()
        textarea.value?.focus()
      })
      return
    }
  }

  if (currentStep.value > 1) {
    currentStep.value--
    nextTick(() => {
      adjustTextareaHeight()
      textarea.value?.focus()
    })
  }
}

const completeInterview = async () => {
  // Save data
  const structuredData = {
    type: "structured_interview",
    investigationId: "interruptions",
    sequence: {
      doing: answers.value[0],
      interrupted_by: answers.value[1],
      immediate_aftermath: answers.value[2],
      what_next: answers.value[3],
      returned: answers.value[4],
      difficulty_returning: answers.value[5],
      what_different: answers.value[6]
    },
    raw_answers: answers.value,
    evidence_collection: true
  }

  try {
    const response = await fetch("/api/courseReflection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        week: 1, // Mapping to Week 1 for now as it's the first investigation
        reflection: JSON.stringify(structuredData),
        userId: authStore.user?.id,
        email: authStore.user?.email
      })
    })

    if (response.ok) {
      isConfirmation.value = true
    } else {
      console.error("Failed to save interview data")
      // Still show confirmation for UX, maybe with a warning or just proceed
      isConfirmation.value = true
    }
  } catch (error) {
    console.error("Error saving interview data:", error)
    isConfirmation.value = true
  }
}

const confirmExit = () => {
  if (confirm("Are you sure you want to exit the interview? Your progress will be lost.")) {
    router.push("/investigation-starter")
  }
}

const viewFirstSnapshot = () => {
  router.push("/continuity")
}

const addAnotherExample = () => {
  currentStep.value = 1
  isStarted.value = false
  isConfirmation.value = false
  answers.value = Array(totalSteps).fill("")
}

onMounted(() => {
  adjustTextareaHeight()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
