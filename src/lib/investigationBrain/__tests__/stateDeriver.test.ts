import { describe, it, expect } from 'vitest';
import { deriveState } from '../stateDeriver';
import type { InvestigationFacts } from '../types';

describe('State Deriver', () => {
  const baseFacts: InvestigationFacts = {
    evidenceCount: 0,
    usableEvidenceCount: 0,
    strongEvidenceCount: 0,
    latestEvidenceCompleteness: 'incomplete',
    missingEvidence: [],
    repeatedElements: [],
    relationshipCandidateExists: false,
    recognitionConfirmed: false,
    contradictionPresent: false
  };

  it('1. state derivation for possible_investigation', () => {
    const facts = { ...baseFacts };
    expect(deriveState(facts)).toBe('possible_investigation');
  });

  it('2. state derivation for active_investigation', () => {
    const facts: InvestigationFacts = { 
      ...baseFacts, 
      evidenceCount: 1, 
      usableEvidenceCount: 0 
    };
    expect(deriveState(facts)).toBe('active_investigation');
  });

  it('3. state derivation for evidence_growing', () => {
    const facts: InvestigationFacts = { 
      ...baseFacts, 
      evidenceCount: 1, 
      usableEvidenceCount: 1,
      relationshipCandidateExists: false
    };
    expect(deriveState(facts)).toBe('evidence_growing');
  });

  it('4. state derivation for relationship_emerging', () => {
    const facts: InvestigationFacts = { 
      ...baseFacts, 
      evidenceCount: 2, 
      usableEvidenceCount: 2,
      relationshipCandidateExists: true,
      recognitionConfirmed: false
    };
    expect(deriveState(facts)).toBe('relationship_emerging');
  });

  it('5. state derivation for discovery_ready', () => {
    const facts: InvestigationFacts = { 
      ...baseFacts, 
      evidenceCount: 2, 
      usableEvidenceCount: 2,
      relationshipCandidateExists: true,
      recognitionConfirmed: true,
      contradictionPresent: false
    };
    expect(deriveState(facts)).toBe('discovery_ready');
  });
});
