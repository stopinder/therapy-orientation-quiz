import { createRouter, createWebHistory } from 'vue-router'
import TherapistQuizView from '../views/TherapistQuizView.vue'

// The therapist reflection replaces the former orientation/ADHD questionnaire.
// Keep its old entry links useful without importing any legacy quiz configuration.
const routes = [
  { path: '/', redirect: '/therapist-quiz' },
  { path: '/therapist-quiz', name: 'TherapistQuiz', component: TherapistQuizView },
  ...['/gateway', '/orientation', '/adhd-quiz', '/investigation-starter', '/landing'].map(path => ({ path, redirect: '/therapist-quiz' })),
  { path: '/:pathMatch(.*)*', redirect: '/therapist-quiz' }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})
