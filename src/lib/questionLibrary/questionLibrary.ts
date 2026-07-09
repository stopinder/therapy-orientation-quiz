import type { Question } from './types';

export const QUESTION_LIBRARY: Question[] = [
  // Familiar situation → recurrence_collection / strengthen_continuity
  {
    id: 'Q_001',
    category: 'recurrence_collection',
    intent: 'strengthen_continuity',
    text: 'When you think about this situation, does it feel like something that has happened before?',
    purpose: 'Check for familiar patterns',
    triggerContext: 'Familiar situation',
    active: true
  },
  // “I’m not sure” → situation_location or starting_point_detection / reduce_pressure
  {
    id: 'Q_002',
    category: 'situation_location',
    intent: 'reduce_pressure',
    text: 'It’s okay not to be sure. Can you tell me about a specific time when this happened, even a small one?',
    purpose: 'Lower pressure to find a "perfect" example',
    triggerContext: 'I’m not sure',
    active: true
  },
  {
    id: 'Q_003',
    category: 'starting_point_detection',
    intent: 'reduce_pressure',
    text: 'Just notice what comes to mind first, without needing it to be the whole story.',
    purpose: 'Lower pressure for starting point',
    triggerContext: 'I’m not sure',
    active: true
  },
  // Interruption → shift_detection / locate_transition
  {
    id: 'Q_004',
    category: 'shift_detection',
    intent: 'locate_transition',
    text: 'What was happening just before that interruption occurred?',
    purpose: 'Identify the moment of transition',
    triggerContext: 'Interruption',
    active: true
  },
  // Body sensation → starting_point_detection or shift_detection / ground
  {
    id: 'Q_005',
    category: 'starting_point_detection',
    intent: 'ground',
    text: 'As you feel that sensation in your body, where does the story begin?',
    purpose: 'Use somatic awareness to ground the starting point',
    triggerContext: 'Body sensation',
    active: true
  },
  // Emotion → shift_detection / understand_sequence
  {
    id: 'Q_006',
    category: 'shift_detection',
    intent: 'understand_sequence',
    text: 'When that emotion showed up, what changed in what you were doing?',
    purpose: 'Understand how emotion fits into the sequence',
    triggerContext: 'Emotion',
    active: true
  },
  // Change of direction → shift_detection / locate_transition
  {
    id: 'Q_007',
    category: 'shift_detection',
    intent: 'locate_transition',
    text: 'At what point did you notice things starting to move in a different direction?',
    purpose: 'Locate the transition point',
    triggerContext: 'Change of direction',
    active: true
  },
  // Returns to task → action_detection or outcome_detection / investigate_reengagement
  {
    id: 'Q_008',
    category: 'action_detection',
    intent: 'investigate_reengagement',
    text: 'What was the first thing you did when you came back to what you were working on?',
    purpose: 'Investigate how reengagement happens',
    triggerContext: 'Returns to task',
    active: true
  },
  // Never returns → outcome_detection / investigate_unfinished_loop
  {
    id: 'Q_009',
    category: 'outcome_detection',
    intent: 'investigate_unfinished_loop',
    text: 'When that happened and you didn’t return to the task, what happened instead?',
    purpose: 'Look at the outcome of an unfinished loop',
    triggerContext: 'Never returns',
    active: true
  },
  // Conflict → shift_detection / locate_organisation
  {
    id: 'Q_010',
    category: 'shift_detection',
    intent: 'locate_organisation',
    text: 'During that conflict, what was the moment you felt the most pulled in two directions?',
    purpose: 'Locate how the experience is organised around conflict',
    triggerContext: 'Conflict',
    active: true
  },
  // Criticism → shift_detection or action_detection / understand_sequence
  {
    id: 'Q_011',
    category: 'shift_detection',
    intent: 'understand_sequence',
    text: 'When you heard that criticism, what was the very next thing you noticed?',
    purpose: 'Understand the sequence following criticism',
    triggerContext: 'Criticism',
    active: true
  },
  // Avoidance → action_detection or outcome_detection / understand_function
  {
    id: 'Q_012',
    category: 'action_detection',
    intent: 'understand_function',
    text: 'In the moment you found yourself avoiding it, what were you doing instead?',
    purpose: 'Understand the function of the avoidance action',
    triggerContext: 'Avoidance',
    active: true
  },
  // Stuck → shift_detection or outcome_detection / restore_movement
  {
    id: 'Q_013',
    category: 'shift_detection',
    intent: 'restore_movement',
    text: 'When you felt stuck, what was the smallest thing that moved or changed?',
    purpose: 'Look for small movements to restore flow',
    triggerContext: 'Stuck',
    active: true
  },
  // Surprise → contrast_check / follow_surprise
  {
    id: 'Q_014',
    category: 'contrast_check',
    intent: 'follow_surprise',
    text: 'That sounds surprising. How is that different from what usually happens?',
    purpose: 'Follow the surprise to find contrast',
    triggerContext: 'Surprise',
    active: true
  },
  // Repetition → recurrence_collection or recognition_check / strengthen_continuity
  {
    id: 'Q_015',
    category: 'recognition_check',
    intent: 'strengthen_continuity',
    text: 'Now that we see this happening again, does it feel like a familiar pattern?',
    purpose: 'Strengthen continuity across repeated examples',
    triggerContext: 'Repetition',
    active: true
  },
  // Another person → situation_location or action_detection / keep_focus
  {
    id: 'Q_016',
    category: 'situation_location',
    intent: 'keep_focus',
    text: 'While other people were involved, what was happening specifically for you?',
    purpose: 'Keep focus on the user’s experience',
    triggerContext: 'Another person',
    active: true
  },
  // “I don’t know why” → situation_location / protect_curiosity
  {
    id: 'Q_017',
    category: 'situation_location',
    intent: 'protect_curiosity',
    text: 'We don’t need to know why yet. Let’s just look at what actually happened in that moment.',
    purpose: 'Protect curiosity by staying with "what" instead of "why"',
    triggerContext: 'I don’t know why',
    active: true
  },
  // Missing evidence → use the relevant missing field category / complete_picture
  {
    id: 'Q_018',
    category: 'example_collection',
    intent: 'complete_picture',
    text: 'Could you share another example where this happened?',
    purpose: 'Complete the picture with more evidence',
    triggerContext: 'Missing evidence',
    active: true
  },
  // Investigation becoming stronger → recognition_check / increase_confidence
  {
    id: 'Q_019',
    category: 'recognition_check',
    intent: 'increase_confidence',
    text: 'Does it seem like we are starting to see how this works?',
    purpose: 'Increase confidence in the emerging recognition',
    triggerContext: 'Investigation becoming stronger',
    active: true
  },
  // Contradiction → contrast_check / challenge
  {
    id: 'Q_020',
    category: 'contrast_check',
    intent: 'challenge',
    text: 'I noticed you mentioned X earlier, but here Y happened. How do those two fit together?',
    purpose: 'Challenge the contradiction to find deeper structure',
    triggerContext: 'Contradiction',
    active: true
  },
  // Ready to pause → confirmation_check / pause
  {
    id: 'Q_021',
    category: 'confirmation_check',
    intent: 'pause',
    text: 'We’ve gathered a lot of good evidence. Does this feel like a good place to pause and look at what we’ve found?',
    purpose: 'Pause the investigation for discovery',
    triggerContext: 'Ready to pause',
    active: true
  },
  // General fallbacks for categories
  {
    id: 'Q_FALLBACK_EXAMPLE',
    category: 'example_collection',
    intent: 'establish',
    text: 'Can you give me a real-life example of when this happens?',
    purpose: 'Collect initial evidence',
    active: true
  },
  {
    id: 'Q_FALLBACK_SITUATION',
    category: 'situation_location',
    intent: 'establish',
    text: 'Where were you and what was happening when this started?',
    purpose: 'Locate the situation',
    active: true
  },
  {
    id: 'Q_FALLBACK_START',
    category: 'starting_point_detection',
    intent: 'establish',
    text: 'What was the very first thing you noticed?',
    purpose: 'Detect starting point',
    active: true
  },
  {
    id: 'Q_FALLBACK_SHIFT',
    category: 'shift_detection',
    intent: 'establish',
    text: 'What changed in that moment?',
    purpose: 'Detect shift',
    active: true
  },
  {
    id: 'Q_FALLBACK_ACTION',
    category: 'action_detection',
    intent: 'establish',
    text: 'What did you do next?',
    purpose: 'Detect action',
    active: true
  },
  {
    id: 'Q_FALLBACK_OUTCOME',
    category: 'outcome_detection',
    intent: 'establish',
    text: 'How did it end or what happened as a result?',
    purpose: 'Detect outcome',
    active: true
  }
];
