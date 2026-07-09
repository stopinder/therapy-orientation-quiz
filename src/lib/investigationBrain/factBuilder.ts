import type { EvidenceItem, InvestigationFacts, EvidenceField } from './types';

export const EVIDENCE_PRIORITY: EvidenceField[] = [
  'real_example',
  'situation',
  'starting_point',
  'shift',
  'action',
  'outcome',
  'recurrence',
  'recognition',
  'contrast',
  'confirmation'
];

export function buildFacts(evidence: EvidenceItem[]): InvestigationFacts {
  const usableEvidence = evidence.filter(e => e.isUsable);
  
  const facts: InvestigationFacts = {
    evidenceCount: evidence.length,
    usableEvidenceCount: usableEvidence.length,
    hasRealExample: evidence.some(e => e.type === 'real_example' && e.isUsable),
    hasSituation: evidence.some(e => e.type === 'situation' && e.isUsable),
    hasStartingPoint: evidence.some(e => e.type === 'starting_point' && e.isUsable),
    hasShift: evidence.some(e => e.type === 'shift' && e.isUsable),
    hasAction: evidence.some(e => (e.type === 'action') && e.isUsable),
    hasOutcome: evidence.some(e => e.type === 'outcome' && e.isUsable),
    hasRecurrence: evidence.some(e => e.type === 'recurrence' && e.isUsable),
    hasRecognition: evidence.some(e => e.type === 'recognition' && e.isUsable),
    hasContrast: evidence.some(e => e.type === 'contrast' && e.isUsable),
    hasConfirmation: evidence.some(e => e.type === 'confirmation' && e.isUsable),
    // These would typically involve more complex logic or analysis from evidence content
    // For v1, we will look for specific evidence types that imply these or placeholders
    hasRepeatedRelationshipCandidate: usableEvidence.length >= 2, 
    hasUnresolvedContradiction: false, // Default to false for deterministic v1 unless specifically flagged
    canLinkDiscoveryToEvidence: usableEvidence.length >= 2,
    allEvidence: evidence
  };

  return facts;
}
