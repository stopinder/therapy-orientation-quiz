/** Editorial dimensions, not validated scales. Negative = left; positive = right. */
export const SCHEMA_VERSION = 'therapist-style-v1';
export const CONTENT_VERSION = 'therapist-style-questions-v1-draft';
export const SCORING_VERSION = 'therapist-style-scoring-v1-draft';
export const DISCLAIMER = 'This is a reflective exercise, not a validated assessment of therapeutic competence, personality or clinical suitability.';

export const DIMENSIONS = Object.freeze({
  direction: { label: 'Sharing direction', left: 'directive', right: 'collaborative' },
  structure: { label: 'Shaping the session', left: 'structured', right: 'emergent' },
  mode: { label: 'Working with experience', left: 'conceptual', right: 'experiential' },
  timeOrientation: { label: 'Looking across time', left: 'present_focused', right: 'developmental' },
  meaningMaking: { label: 'Making sense together', left: 'interpretive', right: 'phenomenological' },
  therapeuticAim: { label: 'What the work moves towards', left: 'change_focused', right: 'understanding_focused' }
});

// Relationship, expertise and diagnostic language are contextual observations,
// not hidden extra scales. Require selections from at least two questions.
export const THEME_DEFINITIONS = Object.freeze({
  offer_perspective: 'Sometimes offers a perspective rather than withholding a view.',
  shared_inquiry: 'Often makes inquiry a shared activity.',
  provisional_hypothesis: 'Treats a hypothesis as something to test rather than settle.',
  withhold_interpretation: 'Sometimes waits for more evidence before introducing an interpretation.',
  relationship_attention: 'Often brings attention to what happens between therapist and client.',
  practical_experiment: 'Sometimes uses an explicit exercise or experiment to explore change.',
  diagnostic_framework: 'May find diagnostic language useful as one provisional organising framework.',
  personal_meaning: 'Often explores what an explanation or label means to this particular client.',
  contextual_meaning: 'Sometimes centres the person’s circumstances when making sense of difficulties.'
});

export const SCORING_RULES = Object.freeze({
  minimumDirectionalResponses: 3,
  minimumCoverage: 0.5,
  slightLean: 0.2,
  moderateLean: 0.45,
  clearLean: 0.7,
  themeMinimumQuestions: 2
});
