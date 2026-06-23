<template>
  <div class="flex items-center space-x-3">
    <button
      @click="toggleRecording"
      type="button"
      :disabled="state === 'transcribing'"
      class="inline-flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50"
      :class="{ 'border-red-200 bg-red-50 text-red-600': state === 'recording' }"
    >
      <!-- Microphone Icon -->
      <svg
        v-if="state !== 'recording'"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
      <!-- Stop Icon -->
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="6" y="6" width="12" height="12" />
      </svg>
      
      <span>{{ buttonLabel }}</span>
    </button>
    
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['transcribed'])

const state = ref('idle') // idle, recording, transcribing, error
const error = ref('')
const mediaRecorder = ref(null)
const audioChunks = ref([])

const buttonLabel = computed(() => {
  if (state.value === 'recording') return 'Stop'
  if (state.value === 'transcribing') return 'Transcribing...'
  return 'Speak'
})

const toggleRecording = () => {
  if (state.value === 'recording') {
    stopRecording()
  } else {
    startRecording()
  }
}

const startRecording = async () => {
  try {
    error.value = ''
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    
    mediaRecorder.value = new MediaRecorder(stream)
    audioChunks.value = []
    
    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data)
    }
    
    mediaRecorder.value.onstop = async () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' })
      sendToTranscription(audioBlob)
      
      // Stop all tracks to release the microphone
      stream.getTracks().forEach(track => track.stop())
    }
    
    mediaRecorder.value.start()
    state.value = 'recording'
  } catch (err) {
    console.error('Recording error:', err)
    error.value = 'Microphone access denied or error'
    state.value = 'idle'
  }
}

const stopRecording = () => {
  if (mediaRecorder.value && state.value === 'recording') {
    mediaRecorder.value.stop()
    state.value = 'transcribing'
  }
}

const sendToTranscription = async (blob) => {
  try {
    // Convert blob to base64 to send via JSON
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = async () => {
      const base64Audio = reader.result
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio: base64Audio,
          mimeType: blob.type
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || 'Transcription failed')
      
      if (data.text) {
        emit('transcribed', data.text)
      }
      state.value = 'idle'
    }
  } catch (err) {
    console.error('Transcription error:', err)
    error.value = err.message
    state.value = 'idle'
  }
}
</script>
