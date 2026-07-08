<template>
  <div class="min-h-screen bg-[#FDFCF9] font-sans text-[#111111]">
    <!-- Simple Header -->
    <header class="p-6 md:p-10 flex justify-between items-center">
      <div class="text-xl font-medium tracking-tight">MindWorks</div>
      <div class="text-sm uppercase tracking-widest text-[#666666]">Investigation Home</div>
    </header>

    <main class="max-w-3xl mx-auto px-6 py-12 md:py-24">
      <div class="mb-16">
        <h1 class="text-4xl md:text-5xl font-light leading-tight mb-8">
          Your investigation has begun.
        </h1>
        <div class="space-y-6 text-lg text-[#333333] leading-relaxed">
          <p>
            MindWorks will become more useful as you add more real examples.
          </p>
          <p>
            One example gives us a starting point.
          </p>
          <p>
            Repeated examples help reveal what may be connected.
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col md:flex-row gap-4 pt-12 border-t border-[#E8E4D8]">
        <router-link
            to="/structured-interview"
            class="bg-[#111111] text-white px-10 py-5 rounded-full hover:bg-[#333333] transition-all font-medium text-center text-lg"
        >
          Add Another Example
        </router-link>
        <router-link
            to="/gateway"
            class="border border-[#D1CDC2] text-[#111111] px-10 py-5 rounded-full hover:bg-[#F3F1EA] transition-all font-medium text-center text-lg"
        >
          Back to Orientation
        </router-link>
      </div>
      
      <!-- History (Optional but useful) -->
      <section v-if="hasHistory" class="mt-24">
        <h2 class="text-xl font-medium mb-8">Previous Examples</h2>
        <div class="space-y-4">
          <div v-for="(item, index) in history" :key="index" class="p-6 bg-white border border-[#E8E4D8] rounded-2xl">
            <div class="text-sm text-[#666666] mb-2">{{ formatDate(item.created_at) }}</div>
            <div class="text-lg font-medium">{{ getSummary(item) }}</div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const rawHistory = ref([])

const hasHistory = computed(() => rawHistory.value.length > 0)

const history = computed(() => {
  return rawHistory.value
    .map(h => {
      try {
        return {
          ...h,
          data: JSON.parse(h.reflection)
        }
      } catch (e) {
        return null
      }
    })
    .filter(h => h && h.data && h.data.type === 'structured_interview')
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

const getSummary = (item) => {
  if (!item.data || !item.data.sequence) return 'Untitled Example'
  const doing = item.data.sequence.doing
  return doing ? `Doing: ${doing.substring(0, 60)}${doing.length > 60 ? '...' : ''}` : 'Untitled Example'
}

onMounted(async () => {
  try {
    const response = await fetch(`/api/getReflectionHistory?userId=${auth.user?.id}`)
    if (response.ok) {
      rawHistory.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching history:', error)
  }
})
</script>
