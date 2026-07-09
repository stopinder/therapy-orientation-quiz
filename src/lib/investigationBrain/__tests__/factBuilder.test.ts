import { describe, it, expect } from 'vitest';
import { buildFacts } from '../factBuilder';
import type { EvidenceItem } from '../types';

describe('Investigation Brain Fact Builder', () => {
  const baseItem: EvidenceItem = {
    id: '1',
    situation: 'Existing situation',
    startingPoint: 'Start',
    shift: 'Shift',
    action: 'Action',
    outcome: 'Outcome',
    recurrenceSignal: '',
    recognition: false,
    contradiction: false,
    createdAt: Date.now()
  };

  it('1. no evidence returns incomplete and asks for real_example', () => {
    const facts = buildFacts([]);
    expect(facts.latestEvidenceCompleteness).toBe('incomplete');
    expect(facts.missingEvidence).toContain('real_example');
  });

  it('2. vague/latest evidence returns incomplete or partial as appropriate', () => {
    // Incomplete (no situation)
    const incompleteItem: EvidenceItem = { ...baseItem, situation: '' };
    const facts1 = buildFacts([incompleteItem]);
    expect(facts1.latestEvidenceCompleteness).toBe('incomplete');

    // Partial (missing outcome)
    const partialItem: EvidenceItem = { ...baseItem, outcome: '' };
    const facts2 = buildFacts([partialItem]);
    expect(facts2.latestEvidenceCompleteness).toBe('partial');
  });

  it('3. missing fields are correctly detected', () => {
    const item: EvidenceItem = { ...baseItem, shift: '', outcome: '' };
    const facts = buildFacts([item]);
    expect(facts.missingEvidence).toContain('shift');
    expect(facts.missingEvidence).toContain('outcome');
    expect(facts.missingEvidence).not.toContain('situation');
    expect(facts.missingEvidence).not.toContain('action');
  });

  it('4. usable evidence is counted correctly', () => {
    const item1: EvidenceItem = { ...baseItem, id: '1' };
    const item2: EvidenceItem = { ...baseItem, id: '2', outcome: '' }; // partial
    const item3: EvidenceItem = { ...baseItem, id: '3', recurrenceSignal: 'often' }; // strong
    
    const facts = buildFacts([item1, item2, item3]);
    // item1 is usable, item3 is strong (which counts as usable)
    expect(facts.usableEvidenceCount).toBe(2);
  });

  it('5. strong evidence is counted correctly', () => {
    const item1: EvidenceItem = { ...baseItem, id: '1' };
    const item2: EvidenceItem = { ...baseItem, id: '2', recurrenceSignal: 'often' }; // strong
    const item3: EvidenceItem = { ...baseItem, id: '3', recognition: true }; // strong
    
    const facts = buildFacts([item1, item2, item3]);
    expect(facts.strongEvidenceCount).toBe(2);
  });

  it('6. repeated elements are detected across two evidence items', () => {
    const item1: EvidenceItem = { ...baseItem, id: '1', situation: 'Work meeting' };
    const item2: EvidenceItem = { ...baseItem, id: '2', situation: 'Work meeting', action: 'Left' };
    
    const facts = buildFacts([item1, item2]);
    expect(facts.repeatedElements).toContain('situation');
    expect(facts.relationshipCandidateExists).toBe(true);
  });

  it('7. recognitionConfirmed becomes true when any evidence item has recognition true', () => {
    const item1: EvidenceItem = { ...baseItem, id: '1', recognition: false };
    const item2: EvidenceItem = { ...baseItem, id: '2', recognition: true };
    
    const facts = buildFacts([item1, item2]);
    expect(facts.recognitionConfirmed).toBe(true);
  });

  it('8. contradictionPresent becomes true when any evidence item has contradiction true', () => {
    const item1: EvidenceItem = { ...baseItem, id: '1', contradiction: false };
    const item2: EvidenceItem = { ...baseItem, id: '2', contradiction: true };
    
    const facts = buildFacts([item1, item2]);
    expect(facts.contradictionPresent).toBe(true);
  });
});
