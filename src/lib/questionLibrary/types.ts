import type { EvidenceField } from '../investigationBrain/types';

export type QuestionCategory =
  | 'example_collection'
  | 'situation_location'
  | 'starting_point_detection'
  | 'shift_detection'
  | 'action_detection'
  | 'outcome_detection'
  | 'recurrence_collection'
  | 'recognition_check'
  | 'contrast_check'
  | 'confirmation_check';

export type InvestigativeIntent =
  | 'establish'
  | 'reduce_pressure'
  | 'locate_transition'
  | 'ground'
  | 'understand_sequence'
  | 'clarify_movement'
  | 'investigate_reengagement'
  | 'investigate_unfinished_loop'
  | 'locate_organisation'
  | 'understand_function'
  | 'restore_movement'
  | 'follow_surprise'
  | 'strengthen_continuity'
  | 'keep_focus'
  | 'protect_curiosity'
  | 'complete_picture'
  | 'increase_confidence'
  | 'challenge'
  | 'pause';

export interface Question {
  id: string;
  category: QuestionCategory;
  intent: InvestigativeIntent;
  text: string;
  purpose: string;
  triggerContext?: string;
  active: boolean;
}

export interface QuestionOptions {
  intent?: InvestigativeIntent;
  triggerContext?: string;
}
