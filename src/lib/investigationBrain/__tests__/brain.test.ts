import { describe, it, expect } from 'vitest';
import { processInvestigation } from '../index';
import type { EvidenceItem } from '../types';

describe('Investigation Brain v1', () => {
  it('1. no evidence → ask for real example', () => {
    const evidence: EvidenceItem[] = [];
    const result = processInvestigation(evidence);
    
    expect(result.currentInvestigationState).toBe('possible_investigation');
    expect(result.nextRequiredEvidenceType).toBe('real_example');
    expect(result.ruleId).toBe('RULE_NO_EVIDENCE');
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
    
    expect(result.currentInvestigationState).toBe('active_investigation');
    expect(result.nextRequiredEvidenceType).toBe('situation');
    expect(result.ruleId).toBe('RULE_VAGUE_FIRST_EVIDENCE');
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
    
    expect(result.currentInvestigationState).toBe('evidence_growing');
    expect(result.nextRequiredEvidenceType).toBe('recurrence');
    expect(result.ruleId).toBe('RULE_ONE_USABLE_EXAMPLE');
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
    
    expect(result.currentInvestigationState).toBe('relationship_emerging');
    expect(result.nextRequiredEvidenceType).toBe('recognition');
    expect(result.ruleId).toBe('RULE_TWO_EXAMPLES_NEED_RECOGNITION');
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
    
    expect(result.currentInvestigationState).toBe('discovery_ready');
    expect(result.discoveryBlocked).toBe(false);
  });
});
