import type { InvestigationFacts, InvestigationState } from './types';

export function deriveState(facts: InvestigationFacts): InvestigationState {
  if (facts.usableEvidenceCount >= 2 && facts.hasRecognition && facts.hasRepeatedRelationshipCandidate && !facts.hasUnresolvedContradiction && facts.canLinkDiscoveryToEvidence) {
    return 'discovery_ready';
  }

  if (facts.usableEvidenceCount >= 2 && facts.hasRepeatedRelationshipCandidate) {
    return 'relationship_emerging';
  }

  if (facts.usableEvidenceCount >= 1) {
    return 'evidence_growing';
  }

  if (facts.evidenceCount > 0) {
    return 'active_investigation';
  }

  return 'possible_investigation';
}
