/** Public UI only. Authorised report generation is a separate future boundary. */
export const therapistStyleRoute = {
  path: '/therapist-style',
  name: 'TherapistStyle',
  component: () => import('../views/TherapistStyleQuizView.vue'),
  meta: { standalone: true }
};
