<script setup lang="ts">
import { ref, computed } from 'vue';
import { processInvestigation, buildFacts } from '../lib/investigationBrain';
import { extractEvidence } from '../lib/evidenceExtractor';
import { getQuestionForDecision } from '../lib/questionLibrary';
import type { EvidenceItem, DecisionPackage, InvestigationFacts } from '../lib/investigationBrain/types';
import type { Question } from '../lib/questionLibrary/types';

interface ConversationTurn {
  userMessage: string;
  extractedEvidence: Partial<EvidenceItem>;
  facts: InvestigationFacts;
  decision: DecisionPackage;
  question: Question;
}

const userMessage = ref('');
const history = ref<ConversationTurn[]>([]);
const isProcessing = ref(false);

const currentEvidence = computed(() => {
  return history.value.map((turn, index) => ({
    ...turn.extractedEvidence,
    id: String(index + 1),
    createdAt: Date.now() + index, // Mock timestamp for sorting
  })) as EvidenceItem[];
});

async function handleSend() {
  if (!userMessage.value.trim() || isProcessing.value) return;

  isProcessing.value = true;
  try {
    const msg = userMessage.value;
    
    // 1. Extract Evidence (Mocked in extractor)
    const extractionResult = await extractEvidence(msg);
    const newEvidencePartial = extractionResult.evidence;

    // 2. Build temporary evidence list including this new turn
    const tempEvidence = [
      ...currentEvidence.value,
      {
        ...newEvidencePartial,
        id: String(history.value.length + 1),
        createdAt: Date.now(),
      } as EvidenceItem
    ];

    // 3. Get Facts and Decision
    const facts = buildFacts(tempEvidence);
    const decision = processInvestigation(tempEvidence);

    // 4. Get Question
    const question = getQuestionForDecision(decision);

    // 5. Save to history
    history.value.push({
      userMessage: msg,
      extractedEvidence: newEvidencePartial,
      facts,
      decision,
      question
    });

    userMessage.value = '';
  } finally {
    isProcessing.value = false;
  }
}

function clearHistory() {
  history.value = [];
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen font-sans">
    <header class="mb-8 flex justify-between items-center border-b pb-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Investigation Brain Debugger</h1>
        <p class="text-gray-600">Step-by-step visualisation of the investigation pipeline.</p>
      </div>
      <button 
        @click="clearHistory" 
        class="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition"
      >
        Clear History
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Input Section -->
      <section class="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border h-fit sticky top-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">User Input</h2>
        <div class="space-y-4">
          <textarea
            v-model="userMessage"
            placeholder="Enter user message here..."
            class="w-full h-32 p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            @keyup.ctrl.enter="handleSend"
          ></textarea>
          <button
            @click="handleSend"
            :disabled="!userMessage.trim() || isProcessing"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {{ isProcessing ? 'Processing...' : 'Process Message' }}
          </button>
          <p class="text-xs text-gray-500 text-center">Press Ctrl+Enter to send</p>
        </div>

        <div class="mt-8">
          <h3 class="font-medium text-gray-700 mb-2">History Summary</h3>
          <ul class="space-y-2">
            <li v-for="(turn, i) in history" :key="i" class="text-sm p-2 bg-gray-50 rounded border flex justify-between">
              <span class="truncate pr-2">Turn {{ i + 1 }}: {{ turn.userMessage }}</span>
              <span class="text-xs font-mono text-blue-600 shrink-0">{{ turn.decision.ruleId }}</span>
            </li>
            <li v-if="history.length === 0" class="text-sm italic text-gray-400">No messages processed yet.</li>
          </ul>
        </div>
      </section>

      <!-- Results Section -->
      <section class="lg:col-span-2 space-y-8">
        <div v-if="history.length === 0" class="bg-white p-12 rounded-lg shadow-sm border text-center text-gray-400">
          Enter a message to see the investigation logic.
        </div>

        <div v-for="(turn, i) in history" :key="i" class="space-y-6">
          <div class="flex items-center gap-4">
            <div class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
              {{ i + 1 }}
            </div>
            <h2 class="text-2xl font-bold text-gray-800">Turn {{ i + 1 }}</h2>
          </div>

          <!-- 1. Original User Message -->
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 class="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">1. User Message</h3>
            <p class="text-gray-900 text-lg italic">"{{ turn.userMessage }}"</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 2. Extracted Evidence -->
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 border-b pb-2">2. Extracted Evidence</h3>
              <dl class="space-y-2 text-sm">
                <div v-for="field in ['situation', 'startingPoint', 'shift', 'action', 'outcome', 'recurrenceSignal']" :key="field" class="flex justify-between py-1 border-b border-gray-50 last:border-0">
                  <dt class="text-gray-500 font-medium capitalize">{{ field.replace(/([A-Z])/g, ' $1') }}:</dt>
                  <dd class="text-gray-900 font-mono text-right pl-4">
                    {{ (turn.extractedEvidence as any)[field] || '—' }}
                  </dd>
                </div>
                <div class="flex justify-between py-1">
                  <dt class="text-gray-500 font-medium">Recognition:</dt>
                  <dd :class="turn.extractedEvidence.recognition ? 'text-green-600 font-bold' : 'text-gray-400'">
                    {{ turn.extractedEvidence.recognition ? 'TRUE' : 'FALSE' }}
                  </dd>
                </div>
                <div class="flex justify-between py-1">
                  <dt class="text-gray-500 font-medium">Contradiction:</dt>
                  <dd :class="turn.extractedEvidence.contradiction ? 'text-orange-600 font-bold' : 'text-gray-400'">
                    {{ turn.extractedEvidence.contradiction ? 'TRUE' : 'FALSE' }}
                  </dd>
                </div>
              </dl>
            </div>

            <!-- 3. Investigation Facts -->
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 border-b pb-2">3. Investigation Facts</h3>
              <dl class="space-y-2 text-sm">
                <div class="flex justify-between py-1 border-b border-gray-50">
                  <dt class="text-gray-500 font-medium">Evidence Count:</dt>
                  <dd class="font-mono">{{ turn.facts.evidenceCount }}</dd>
                </div>
                <div class="flex justify-between py-1 border-b border-gray-50">
                  <dt class="text-gray-500 font-medium">Usable / Strong:</dt>
                  <dd class="font-mono">{{ turn.facts.usableEvidenceCount }} / {{ turn.facts.strongEvidenceCount }}</dd>
                </div>
                <div class="flex flex-col py-1 border-b border-gray-50">
                  <dt class="text-gray-500 font-medium mb-1">Missing Evidence:</dt>
                  <dd class="flex flex-wrap gap-1">
                    <span v-for="field in turn.facts.missingEvidence" :key="field" class="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded border border-red-100">
                      {{ field }}
                    </span>
                    <span v-if="turn.facts.missingEvidence.length === 0" class="text-green-600 text-xs">None</span>
                  </dd>
                </div>
                <div class="flex flex-col py-1 border-b border-gray-50">
                  <dt class="text-gray-500 font-medium mb-1">Repeated Elements:</dt>
                  <dd class="flex flex-wrap gap-1">
                    <span v-for="field in turn.facts.repeatedElements" :key="field" class="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded border border-blue-100">
                      {{ field }}
                    </span>
                    <span v-if="turn.facts.repeatedElements.length === 0" class="text-gray-400 text-xs italic">None detected</span>
                  </dd>
                </div>
                <div class="flex justify-between py-1">
                  <dt class="text-gray-500 font-medium">Pattern Confirmed:</dt>
                  <dd :class="turn.facts.recognitionConfirmed ? 'text-green-600 font-bold' : 'text-gray-400'">
                    {{ turn.facts.recognitionConfirmed ? 'YES' : 'NO' }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 4. Investigation State -->
            <div class="bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-900 text-white">
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 border-b border-gray-700 pb-2">4. Investigation State</h3>
              <div class="text-center py-4">
                <span class="text-2xl font-mono text-blue-400 tracking-tight">{{ turn.decision.state }}</span>
              </div>
            </div>

            <!-- 5. Decision Package -->
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 border-b pb-2">5. Decision Package</h3>
              <dl class="space-y-2 text-sm">
                <div class="flex justify-between py-1">
                  <dt class="text-gray-500 font-medium">Rule Matched:</dt>
                  <dd class="font-bold text-blue-600">{{ turn.decision.ruleId }}</dd>
                </div>
                <div class="flex justify-between py-1">
                  <dt class="text-gray-500 font-medium">Next Evidence:</dt>
                  <dd class="font-mono bg-gray-100 px-1 rounded">{{ turn.decision.nextEvidenceType || 'NONE' }}</dd>
                </div>
                <div class="flex justify-between py-1">
                  <dt class="text-gray-500 font-medium">Category:</dt>
                  <dd class="text-gray-700 italic">{{ turn.decision.questionCategory || 'N/A' }}</dd>
                </div>
                <div class="pt-2 mt-2 border-t">
                  <dt class="text-gray-500 font-medium mb-1">Status:</dt>
                  <dd v-if="turn.decision.discoveryBlocked" class="text-red-600 flex flex-col gap-1">
                    <span class="font-bold">BLOCKED</span>
                    <span class="text-xs">Reason: {{ turn.decision.blockedBecause }}</span>
                    <span class="text-xs text-gray-500">Unblock: {{ turn.decision.wouldUnblock }}</span>
                  </dd>
                  <dd v-else class="text-green-600 font-bold">READY FOR DISCOVERY</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- 6. Selected Question -->
          <div class="bg-green-50 p-6 rounded-lg border border-green-200 shadow-sm relative overflow-hidden">
            <div class="absolute top-0 right-0 p-2 bg-green-200 text-green-800 text-[10px] font-bold uppercase rounded-bl">
              Library Selection: {{ turn.question.id }}
            </div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-green-700 mb-2">6. Selected Question</h3>
            <p class="text-xl text-gray-900 font-medium leading-relaxed">{{ turn.question.text }}</p>
            <div class="mt-4 flex gap-4 text-xs">
              <span class="bg-green-100 text-green-700 px-2 py-1 rounded">Intent: {{ turn.question.intent }}</span>
              <span class="bg-green-100 text-green-700 px-2 py-1 rounded">Purpose: {{ turn.question.purpose }}</span>
            </div>
          </div>

          <hr class="border-gray-300 border-dashed my-12" v-if="i < history.length - 1" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>
