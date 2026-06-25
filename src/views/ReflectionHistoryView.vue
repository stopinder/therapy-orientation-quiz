```vue
<template>
  <main class="min-h-screen bg-slate-50 px-6 py-16">

    <div class="mx-auto max-w-5xl">

      <!-- Header -->

      <div class="mb-14">

        <p class="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
          Visibility Path Summary
        </p>

        <h1 class="text-4xl font-semibold tracking-tight text-slate-950">
          Accumulated Observations
        </h1>

        <p class="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
          MindWorks looks across your reflections to show what is becoming visible over time.
        </p>

      </div>

      <!-- Discovery Layer v1 — prototype -->
      <section class="mb-16">
        <div class="overflow-hidden rounded-[2.5rem] border border-slate-900 bg-slate-900 p-10 text-white shadow-2xl">
          <div class="max-w-3xl">
            <p class="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Visibility Summary
            </p>

            <div v-if="reflections.length >= 3">
              <div v-if="summaryLoading" class="py-12 flex flex-col items-center justify-center text-center">
                <div class="mb-6 h-12 w-12 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center animate-pulse">
                  <div class="h-6 w-6 rounded-full bg-slate-400 opacity-50"></div>
                </div>
                
                <Transition
                  mode="out-in"
                  enter-active-class="transition duration-500 ease-out"
                  enter-from-class="opacity-0 translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition duration-500 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-2"
                >
                  <p :key="currentSummaryLoadingMessage" class="text-xl font-medium text-slate-200">
                    {{ currentSummaryLoadingMessage }}
                  </p>
                </Transition>
                
                <p class="mt-4 text-sm text-slate-500">
                  This usually takes a few seconds.
                </p>
              </div>

              <div v-else-if="continuitySummary">
                <p class="mb-6 text-sm font-semibold uppercase tracking-wider text-slate-500">
                  What is becoming visible
                </p>
                
                <div class="space-y-8">
                  <div 
                    v-for="(section, idx) in parsedContinuitySummary" 
                    :key="idx"
                  >
                    <h4 v-if="section.title" class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {{ section.title }}
                    </h4>
                    <div class="whitespace-pre-line text-lg leading-relaxed text-slate-300">
                      {{ section.content }}
                    </div>
                  </div>
                </div>

                <p class="mt-8 pt-6 border-t border-slate-800 text-sm leading-relaxed text-slate-500">
                  This is not a conclusion. It is what MindWorks is beginning to notice across recent observations.
                </p>
              </div>
            </div>
            
            <div v-else-if="reflections.length === 2">
              <p class="text-lg leading-relaxed text-slate-300">
                MindWorks is collecting observations. Patterns become visible through repetition.
              </p>
            </div>

            <div v-else>
              <!-- 0 or 1 reflection: show no personal insight -->
              <p class="text-lg leading-relaxed text-slate-300">
                MindWorks looks across your reflections to show what is becoming visible over time. Personal insights appear as more reflections are added.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Loading -->

      <div
          v-if="loading"
          class="text-slate-500"
      >
        Restoring continuity history...
      </div>

      <!-- Empty -->

      <div
          v-else-if="!reflections.length"
          class="rounded-3xl border border-slate-200 bg-white p-10 text-slate-500 shadow-sm"
      >
        No reflections recorded yet.
      </div>

      <!-- Timeline -->


      <div
          v-else
          class="space-y-8"
      >

        <!-- Phase 4 Continuity Surface — Archive Collapse -->
        <button
            @click="isArchiveCollapsed = !isArchiveCollapsed"
            class="group flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:bg-slate-50 shadow-sm"
        >
          <span class="text-lg font-semibold text-slate-900">
            View Recent Observations
          </span>
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
              :class="{ 'rotate-180': !isArchiveCollapsed }"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <div
            v-if="!isArchiveCollapsed"
            class="space-y-3"
        >
          <p class="text-xs text-slate-500 mb-4">
            Showing latest {{ visibleArchiveReflections.length }} observations
          </p>

          <section
              v-for="item in visibleArchiveReflections"
              :key="item.id"
              class="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm"
          >

          <!-- Metadata row -->
          <p class="text-sm text-slate-500 leading-relaxed">
            Stage {{ item.week_number }}&nbsp;·&nbsp;{{ getWeekTitle(item.week_number) }}&nbsp;·&nbsp;{{ formatDate(item.created_at) }}
          </p>

          <!-- Original Reflection -->
          <div class="mt-3">
            <h3 class="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Original observation
            </h3>
            <div class="mt-1 text-base leading-relaxed text-slate-800">
              {{ item.original_reflection }}
            </div>
          </div>

          <!-- AI Reflection Collapsible -->
          <details class="group mt-3">
            <summary class="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-open:rotate-180">
                <path d="m6 9 6 6 6-6"/>
              </svg>
              View MindWorks Reflection
            </summary>
            <div class="mt-4 rounded-xl bg-slate-50 p-6 text-base leading-relaxed text-slate-600 whitespace-pre-line">
              {{ item.ai_response }}
            </div>
          </details>

        </section>

        <!-- Show more button -->
        <div v-if="hasMoreReflections" class="pt-4 text-center">
          <button
            @click="showMore"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
          >
            Show more observations
          </button>
        </div>

      </div>

    </div>

  </div>

</main>
</template>

  <script setup>
import {
  computed,
  onMounted,
  ref,
  watch
} from "vue"

import { useAuthStore }
  from "../stores/auth"

import { courseWeeks }
  from "../data/courseWeeks"

const BEHAVIORAL_MAP = {
  'Something else repeatedly happens before beginning.': ['preparing', 'prepare', 'preparation', 'reorganised', 'reorganized', 'reorganise', 'reorganize', 'desk', 'notes', 'organising', 'organizing', 'planning', 'research', 'tidying'],
  'Attention drifts to digital tools or rituals before starting.': ['email', 'messages', 'messaging', 'scrolling', 'tea', 'coffee', 'before starting', 'before beginning', 'before making', 'before joining'],
  'Delay occurs immediately after an intention is formed.': ['delay', 'delayed', 'hesitation', 'hesitant', 'postponed', 'postponing'],
  'A verification ritual repeatedly precedes action.': ['checking', 'checked', 'rechecked', 'monitoring']
}

const isArchiveCollapsed = ref(true)
const archiveLimit = ref(5)

const filteredReflections = computed(() => {
  if (!reflections.value) return []
  
  const seen = new Set()
  return reflections.value.filter(item => {
    const text = (item.original_reflection || "").trim()
    
    // Filter out obvious test/malformed placeholders
    if (text.toLowerCase().startsWith("int ")) return false
    
    // Filter out exact duplicates
    if (seen.has(text)) return false
    seen.add(text)
    
    return true
  })
})

const visibleArchiveReflections = computed(() => {
  return filteredReflections.value.slice(0, archiveLimit.value)
})

const hasMoreReflections = computed(() => {
  return filteredReflections.value.length > archiveLimit.value
})

const showMore = () => {
  archiveLimit.value += 5
}

const auth =
    useAuthStore()

const reflections =
    ref([])

const loading =
    ref(true)

const summaryLoading = ref(false)

const summaryLoadingMessages = [
  "MindWorks is reviewing your recent observations…",
  "Looking for recurring sequences…",
  "Comparing moments across time…",
  "Looking for what repeats—and what changes…",
  "Building your Visibility Summary…"
]

const currentSummaryLoadingMessage = ref(summaryLoadingMessages[0])
let summaryLoadingInterval = null

const startSummaryLoadingRotation = () => {
  let index = 0
  currentSummaryLoadingMessage.value = summaryLoadingMessages[0]
  summaryLoadingInterval = setInterval(() => {
    index = (index + 1) % summaryLoadingMessages.length
    currentSummaryLoadingMessage.value = summaryLoadingMessages[index]
  }, 2000)
}

const stopSummaryLoadingRotation = () => {
  if (summaryLoadingInterval) {
    clearInterval(summaryLoadingInterval)
    summaryLoadingInterval = null
  }
}

const recentThemes = computed(() => {
  if (!reflections.value || reflections.value.length === 0) return []

  const latestThree = reflections.value.slice(0, 3)
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
  return recentThemes.value.length > 0 && recentThemes.value[0].count >= 2
      ? recentThemes.value[0]
      : null
})

const possibleFunctionQuestion = computed(() => {
  if (!topPattern.value) return null

  const questions = {
    'Something else repeatedly happens before beginning.': 'What becomes easier when beginning is postponed?',
    'Attention drifts to digital tools or rituals before starting.': 'What might this sequence be helping you postpone?',
    'Delay occurs immediately after an intention is formed.': 'What no longer has to be faced when entry is delayed?',
    'A verification ritual repeatedly precedes action.': 'What becomes easier once this sequence unfolds?'
  }

  return questions[topPattern.value.name] || 'What might this sequence be helping you postpone?'
})

const continuitySummary = ref("")

const parsedContinuitySummary = computed(() => {
  if (!continuitySummary.value) return []

  // Safety cleanup: ensure "stomach" is used instead of "tummy"
  // Also clean up any stray raw JSON or markdown code blocks
  const cleanSummary = continuitySummary.value
    .replace(/tummy/gi, 'stomach')
    .replace(/```json\s*[\s\S]*?```/g, '')
    .trim()

  const sections = []
  const lines = cleanSummary.split('\n')
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

const fetchContinuitySummary =
    async () => {

      try {

        if (!auth.user?.id) return

        const userStage = reflections.value?.[0]?.week_number || 6
        console.log("Fetching continuity summary for:", auth.user.id, "at stage:", userStage)
        
        summaryLoading.value = true
        startSummaryLoadingRotation()

        const result = await fetch(
            "/api/getContinuitySummary",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                userId: auth.user.id,
                currentStage: userStage
              })
            }
        )

        const data = await result.json()
        console.log("Continuity summary received:", data.markdown_summary || data.summary)
        continuitySummary.value = data.markdown_summary || data.summary || ""
      } catch (err) {

        console.error("CONTINUITY SUMMARY ERROR:", err)

      } finally {
        summaryLoading.value = false
        stopSummaryLoadingRotation()
      }

    }

const getWeekTitle =
    (weekNumber) => {

      const week =
          courseWeeks.find(
              (item) =>
                  item.number ===
                  weekNumber
          )

      return (
          week?.title ||
          "Unknown Stage"
      )

    }

const formatDate =
    (dateString) => {

      return new Date(
          dateString
      ).toLocaleDateString(
          "en-GB",
          {
            year: "numeric",
            month: "long",
            day: "numeric"
          }
      )

    }

const loadReflections =
    async () => {

      console.log("ReflectionHistory auth user id:", auth.user?.id)

      try {

        if (
            !auth.user?.id
        ) {
          return
        }

        console.log("Loading reflection history for:", auth.user?.id)

        const result = await fetch(
            "/api/getReflectionHistory",
            {
              method: "POST",

              headers: {
                "Content-Type":
                    "application/json"
              },

              body: JSON.stringify({

                userId:
                auth.user.id

              })
            }
        )

        const data =
            await result.json()

        console.log("Reflections received:", data.reflections?.length || 0)

        reflections.value =
            data.reflections || []

      } catch (err) {

        console.error(
            "TIMELINE ERROR:",
            err
        )

      } finally {

        loading.value =
            false

      }

    }

watch(
  () => auth.user?.id,
  (userId) => {
    if (userId && reflections.value.length === 0) {
      loadReflections()
    }
  },
  { immediate: true }
)

onMounted(async () => {

  if (auth.user?.id) {
    await Promise.all([
      loadReflections(),
      fetchContinuitySummary()
    ])
  } else {
    // Summary also needs auth.user.id
    watch(
      () => auth.user?.id,
      (userId) => {
        if (userId) {
          fetchContinuitySummary()
        }
      },
      { once: true }
    )
  }

})
</script>
```
