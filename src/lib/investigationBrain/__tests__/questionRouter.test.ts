import { describe, it, expect } from 'vitest';
import { routeQuestion, QUESTION_ROUTER } from '../questionRouter';
import type { EvidenceField } from '../types';

describe('Question Router', () => {
  it('6. every nextEvidenceType maps to the correct questionCategory', () => {
    const mappings: Record<EvidenceField, string> = {
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

    (Object.keys(mappings) as EvidenceField[]).forEach(field => {
      expect(routeQuestion(field)).toBe(mappings[field]);
    });
  });

  it('returns null for null evidence type', () => {
    expect(routeQuestion(null)).toBe(null);
  });
});
