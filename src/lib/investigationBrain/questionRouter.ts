import type { EvidenceField } from './types';

export const QUESTION_ROUTER: Record<EvidenceField, string> = {
  real_example: 'example_collection',
  situation: 'situation_location',
  starting_point: 'starting_point_detection',
  shift: 'shift_detection',
  action: 'action_detection',
  outcome: 'outcome_detection',
  recurrence: 'recurrence_collection',
  recognition: 'recognition_check',
  contrast: 'contrast_check',
  confirmation: 'confirmation_check'
};

export function routeQuestion(evidenceType: EvidenceField | null): string | null {
  if (!evidenceType) return null;
  return QUESTION_ROUTER[evidenceType] || null;
}
