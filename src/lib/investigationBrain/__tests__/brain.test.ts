import { describe, it, expect } from 'vitest';
import { processInvestigation } from '../index';
import type { EvidenceItem } from '../types';

describe('Investigation Brain v1', () => {
  it('1. no evidence → ask for real example', () => {
    const evidence: EvidenceItem[] = [];
    const result = processInvestigation(evidence);
    
    expect(result.state).toBe('possible_investigation');
    expect(result.nextEvidenceType).toBe('real_example');
    expect(result.ruleId).toBe('RULE_001');
    expect(result.discoveryBlocked).toBe(true);
  });

  it('2. one vague evidence item → ask for missing situation', () => {
    const evidence: EvidenceItem[] = [
      { 
        id: '1', 
        situation: '', 
        startingPoint: '', 
        shift: '', 
        action: '', 
        outcome: '', 
        recurrenceSignal: '', 
        recognition: false, 
        contradiction: false, 
        createdAt: Date.now() 
      }
    ];
    const result = processInvestigation(evidence);
    
    expect(result.state).toBe('active_investigation');
    expect(result.nextEvidenceType).toBe('situation');
    expect(result.ruleId).toBe('RULE_002');
    expect(result.discoveryBlocked).toBe(true);
  });

  it('3. one usable example → ask for recurrence', () => {
    const evidence: EvidenceItem[] = [
      { 
        id: '1', 
        situation: 'A valid example', 
        startingPoint: 'start', 
        shift: 'shift', 
        action: 'action', 
        outcome: 'outcome', 
        recurrenceSignal: '', 
        recognition: false, 
        contradiction: false, 
        createdAt: Date.now() 
      }
    ];
    const result = processInvestigation(evidence);
    
    expect(result.state).toBe('evidence_growing');
    expect(result.nextEvidenceType).toBe('recurrence');
    expect(result.ruleId).toBe('RULE_007');
    expect(result.discoveryBlocked).toBe(true);
  });

  it('4. two examples with repeated elements → ask for recognition', () => {
    const evidence: EvidenceItem[] = [
      { 
        id: '1', 
        situation: 'Repeat', 
        startingPoint: 's', 
        shift: 'sh', 
        action: 'a', 
        outcome: 'o', 
        recurrenceSignal: '', 
        recognition: false, 
        contradiction: false, 
        createdAt: Date.now() 
      },
      { 
        id: '2', 
        situation: 'Repeat', 
        startingPoint: 's2', 
        shift: 'sh2', 
        action: 'a2', 
        outcome: 'o2', 
        recurrenceSignal: '', 
        recognition: false, 
        contradiction: false, 
        createdAt: Date.now() + 1 
      }
    ];
    const result = processInvestigation(evidence);
    
    expect(result.state).toBe('relationship_emerging');
    expect(result.nextEvidenceType).toBe('recognition');
    expect(result.ruleId).toBe('RULE_008');
    expect(result.discoveryBlocked).toBe(true);
  });

  it('5. two usable examples + repeated element + recognition confirmed → discovery ready', () => {
    const evidence: EvidenceItem[] = [
      { 
        id: '1', 
        situation: 'Repeat', 
        startingPoint: 's', 
        shift: 'sh', 
        action: 'a', 
        outcome: 'o', 
        recurrenceSignal: '', 
        recognition: true, 
        contradiction: false, 
        createdAt: Date.now() 
      },
      { 
        id: '2', 
        situation: 'Repeat', 
        startingPoint: 's2', 
        shift: 'sh2', 
        action: 'a2', 
        outcome: 'o2', 
        recurrenceSignal: '', 
        recognition: false, 
        contradiction: false, 
        createdAt: Date.now() + 1 
      }
    ];
    const result = processInvestigation(evidence);
    
    expect(result.state).toBe('discovery_ready');
    expect(result.discoveryBlocked).toBe(false);
    expect(result.ruleId).toBe('RULE_010');
  });
});
