import { describe, it, expect } from 'vitest';
import { applyRules } from '../ruleEngine';
import type { InvestigationFacts } from '../types';

describe('Investigation Brain Rule Engine', () => {
  const baseFacts: InvestigationFacts = {
    evidenceCount: 0,
    usableEvidenceCount: 0,
    strongEvidenceCount: 0,
    latestEvidenceCompleteness: 'incomplete',
    missingEvidence: ['real_example'],
    repeatedElements: [],
    relationshipCandidateExists: false,
    recognitionConfirmed: false,
    contradictionPresent: false
  };

  it('RULE_001: highest priority when no evidence', () => {
    const facts = { ...baseFacts };
    const result = applyRules(facts);
    expect(result.ruleId).toBe('RULE_001');
    expect(result.nextEvidenceType).toBe('real_example');
  });

  it('RULE_002: situation missing', () => {
    const facts: InvestigationFacts = { 
      ...baseFacts, 
      evidenceCount: 1, 
      missingEvidence: ['situation'],
      latestEvidenceCompleteness: 'incomplete'
    };
    const result = applyRules(facts);
    expect(result.ruleId).toBe('RULE_002');
    expect(result.nextEvidenceType).toBe('situation');
  });

  it('RULE_007: fewer than two usable examples', () => {
    const facts: InvestigationFacts = { 
      ...baseFacts, 
      evidenceCount: 1, 
      usableEvidenceCount: 1,
      missingEvidence: [],
      latestEvidenceCompleteness: 'usable'
    };
    const result = applyRules(facts);
    expect(result.ruleId).toBe('RULE_007');
    expect(result.nextEvidenceType).toBe('recurrence');
  });

  it('RULE_008: relationship candidate exists but recognition not confirmed', () => {
    const facts: InvestigationFacts = { 
      ...baseFacts, 
      evidenceCount: 2, 
      usableEvidenceCount: 2,
      missingEvidence: [],
      latestEvidenceCompleteness: 'usable',
      relationshipCandidateExists: true,
      recognitionConfirmed: false
    };
    const result = applyRules(facts);
    expect(result.ruleId).toBe('RULE_008');
    expect(result.nextEvidenceType).toBe('recognition');
  });

  it('RULE_009: contradiction present', () => {
    const facts: InvestigationFacts = { 
      ...baseFacts, 
      evidenceCount: 2, 
      usableEvidenceCount: 2,
      missingEvidence: [],
      latestEvidenceCompleteness: 'strong',
      relationshipCandidateExists: true,
      recognitionConfirmed: true,
      contradictionPresent: true
    };
    const result = applyRules(facts);
    expect(result.ruleId).toBe('RULE_009');
    expect(result.nextEvidenceType).toBe('contrast');
  });

  it('RULE_010: discovery ready', () => {
    const facts: InvestigationFacts = { 
      ...baseFacts, 
      evidenceCount: 2, 
      usableEvidenceCount: 2,
      missingEvidence: [],
      latestEvidenceCompleteness: 'strong',
      relationshipCandidateExists: true,
      recognitionConfirmed: true,
      contradictionPresent: false
    };
    const result = applyRules(facts);
    expect(result.ruleId).toBe('RULE_010');
    expect(result.discoveryBlocked).toBe(false);
    expect(result.nextEvidenceType).toBeNull();
  });

  it('discovery is blocked until RULE_010', () => {
    // Check RULE_001
    expect(applyRules({ ...baseFacts }).discoveryBlocked).toBe(true);
    // Check RULE_007
    expect(applyRules({ ...baseFacts, evidenceCount: 1, usableEvidenceCount: 1, missingEvidence: [] }).discoveryBlocked).toBe(true);
    // Check RULE_008
    expect(applyRules({ 
      ...baseFacts, 
      evidenceCount: 2, 
      usableEvidenceCount: 2, 
      missingEvidence: [], 
      relationshipCandidateExists: true, 
      recognitionConfirmed: false 
    }).discoveryBlocked).toBe(true);
    
    // Check RULE_010
    expect(applyRules({ 
      ...baseFacts, 
      evidenceCount: 2, 
      usableEvidenceCount: 2, 
      missingEvidence: [], 
      relationshipCandidateExists: true, 
      recognitionConfirmed: true 
    }).discoveryBlocked).toBe(false);
  });
});
