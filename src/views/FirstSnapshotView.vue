<template>
  <div class="min-h-screen bg-[#FDFCF9] font-sans text-[#111111]">
    <!-- Simple Header -->
    <header class="p-6 md:p-10 flex justify-between items-center">
      <div class="text-xl font-medium tracking-tight">MindWorks</div>
      <div class="text-sm uppercase tracking-widest text-[#666666]">First Snapshot</div>
    </header>

    <main class="max-w-3xl mx-auto px-6 py-12 md:py-24">
      <div class="mb-16">
        <h1 class="text-4xl md:text-5xl font-light leading-tight mb-8">
          One example has been added.
        </h1>
        <div class="space-y-6 text-lg text-[#333333] leading-relaxed">
          <p>
            MindWorks has captured one sequence from your investigation.
          </p>
          <p>
            This does not prove a pattern yet.
          </p>
          <p>
            It gives the investigation a first piece of evidence to compare with future examples.
          </p>
        </div>
      </div>

      <!-- Captured Sequence -->
      <section class="mb-16">
        <h2 class="text-2xl font-medium mb-8 pb-4 border-b border-[#E8E4D8]">
          Captured sequence
        </h2>
        
        <div v-if="lastInterview" class="space-y-8">
          <div v-for="(item, index) in sequenceFields" :key="index">
            <h3 class="text-sm uppercase tracking-wider text-[#666666] mb-2">{{ item.label }}</h3>
            <p class="text-xl text-[#111111] leading-relaxed">
              {{ formatValue(item.key) || '—' }}
            </p>
          </div>
        </div>
        <div v-else class="p-8 bg-[#F3F1EA] rounded-2xl text-center">
          <p class="text-[#666666]">No sequence found. Add an example to begin.</p>
        </div>
      </section>

      <!-- Actions -->
      <div class="flex flex-col md:flex-row gap-4 pt-12 border-t border-[#E8E4D8]">
        <router-link
            to="/structured-interview"
            class="bg-[#111111] text-white px-10 py-5 rounded-full hover:bg-[#333333] transition-all font-medium text-center text-lg"
        >
          Add Another Example
        </router-link>
        <router-link
            to="/investigation-home"
            class="border border-[#D1CDC2] text-[#111111] px-10 py-5 rounded-full hover:bg-[#F3F1EA] transition-all font-medium text-center text-lg"
        >
          Go to Investigation Home
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const lastInterview = ref(null)

const sequenceFields = [
  { label: 'What you were doing', key: 'doing' },
  { label: 'What interrupted it', key: 'interrupted_by' },
  { label: 'What happened immediately afterwards', key: 'immediate_aftermath' },
  { label: 'What you did next', key: 'what_next' },
  { label: 'Whether you returned', key: 'returned' },
  { label: 'What made returning harder', key: 'difficulty_returning' },
  { label: 'What was different afterwards', key: 'what_different' }
]

const formatValue = (key) => {
  if (!lastInterview.value || !lastInterview.value.sequence) return null
  const val = lastInterview.value.sequence[key]
  
  if (key === 'returned') {
    const options = {
      'soon': 'Yes, quite soon.',
      'later': 'Yes, but later than intended.',
      'no_moved_on': 'No, I moved on to something else.',
      'no_unfinished': 'No, it stayed unfinished.',
      'unsure': 'I’m not sure.'
    }
    return options[val] || val
  }
  
  if (key === 'difficulty_returning') {
    const options = {
      'lost_place': 'I lost my place.',
      'heavier': 'The task felt heavier.',
      'urgent': 'Something else became more urgent.',
      'forgot': 'I forgot about it.',
      'avoided': 'I avoided going back to it.',
      'thinking_about_interruption': 'I was still thinking about the interruption.',
      'unsure': 'I’m not sure.'
    }
    return options[val] || val
  }
  
  return val
}

onMounted(async () => {
  // Try to fetch last interview from API
  try {
    const response = await fetch(`/api/getReflectionHistory?userId=${auth.user?.id}`)
    if (response.ok) {
      const history = await response.json()
      // Filter for structured interviews
      const interviews = history
        .map(h => {
          try { return JSON.parse(h.reflection) }
          catch (e) { return null }
        })
        .filter(r => r && r.type === 'structured_interview')
      
      if (interviews.length > 0) {
        lastInterview.value = interviews[0] // Assuming the API returns most recent first
      }
    }
  } catch (error) {
    console.error('Error fetching history:', error)
  }
})
</script>
