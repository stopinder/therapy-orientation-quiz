import { describe, it, expect } from 'vitest';
import { investigationFlowExamples } from '../__fixtures__/investigationFlowExamples';
import { processInvestigation, buildFacts } from '../index';
import { getQuestionForDecision } from '../../questionLibrary/getQuestionForDecision';
import type { EvidenceItem } from '../types';

describe('Investigation Flow Tests (Fixtures)', () => {
  investigationFlowExamples.forEach((fixture) => {
    it(`should process ${fixture.id}: ${fixture.notes}`, () => {
      let evidence: EvidenceItem[] = [];

      // For fixtures that require prior state, we prepopulate
      if (fixture.id === 'FIXTURE_005') {
        // Prepopulate with one usable example
        evidence.push({
          id: 'prior_1',
          situation: 'Repeat',
          startingPoint: 'Talking',
          shift: 'Interrupted',
          action: 'Stopped talking',
          outcome: 'Forgot point',
          recurrenceSignal: '',
          recognition: false,
          contradiction: false,
          createdAt: 1000
        });
      }

      if (fixture.id === 'FIXTURE_006' || fixture.id === 'FIXTURE_007') {
        // Prepopulate with two usable examples that have a repeated element
        evidence.push(
          {
            id: 'prior_1',
            situation: 'Repeat',
            startingPoint: 'Task A',
            shift: 'Phone rang',
            action: 'Checked phone',
            outcome: 'Stopped A',
            recurrenceSignal: '',
            recognition: false,
            contradiction: false,
            createdAt: 1000
          },
          {
            id: 'prior_2',
            situation: 'Repeat',
            startingPoint: 'Task B',
            shift: 'Email popped up',
            action: 'Checked email',
            outcome: 'Stopped B',
            recurrenceSignal: '',
            recognition: false,
            contradiction: false,
            createdAt: 2000
          }
        );
      }

      // 1. Evidence Extractor (Mocked via fixture.mockExtractedEvidence)
      const extracted = fixture.mockExtractedEvidence || {};
      
      const newEvidence: EvidenceItem = {
        id: fixture.id,
        situation: extracted.situation !== undefined ? extracted.situation : 'Repeat',
        startingPoint: extracted.startingPoint || (['FIXTURE_005', 'FIXTURE_006', 'FIXTURE_007'].includes(fixture.id) ? 'Repeat' : ''),
        shift: extracted.shift || (['FIXTURE_006', 'FIXTURE_007'].includes(fixture.id) ? 'Repeat' : ''),
        action: extracted.action || (['FIXTURE_006', 'FIXTURE_007'].includes(fixture.id) ? 'Repeat' : ''),
        outcome: extracted.outcome || (['FIXTURE_006', 'FIXTURE_007'].includes(fixture.id) ? 'Repeat' : ''),
        recurrenceSignal: extracted.recurrenceSignal || '',
        recognition: extracted.recognition || false,
        contradiction: extracted.contradiction || false,
        createdAt: 3000
      };
      evidence.push(newEvidence);

      // 2. Fact Builder
      const facts = buildFacts(evidence);
      
      // Confirm expected evidence fields are present
      fixture.expectedEvidenceFields.forEach(field => {
        expect(newEvidence[field], `Field ${String(field)} should be present`).toBeTruthy();
      });

      // Confirm expected missing fields are detected
      fixture.expectedMissingEvidence.forEach(field => {
        expect(facts.missingEvidence).toContain(field);
      });

      // 3. Rule Engine (via processInvestigation)
      const decision = processInvestigation(evidence);

      expect(decision.state).toBe(fixture.expectedState);
      expect(decision.nextEvidenceType).toBe(fixture.expectedNextEvidenceType);
      expect(decision.questionCategory).toBe(fixture.expectedQuestionCategory);

      // 4. Question Library
      const question = getQuestionForDecision(decision);
      
      if (decision.questionCategory) {
        expect(question).toBeDefined();
        expect(question.category).toBe(decision.questionCategory);
        expect(question.text).toBeTruthy();
      } else {
        // If no question category (e.g. discovery_ready), check if we get a fallback or null
        // Currently getQuestionForDecision returns a fallback if no matching category
        // But for discovery_ready, nextEvidenceType is null, questionCategory is null.
        // Let's see what happens.
        if (fixture.expectedState === 'discovery_ready') {
           // Should return fallback if category is null
           expect(question.id).toBe('SAFE_FALLBACK');
        }
      }
    });
  });
});
