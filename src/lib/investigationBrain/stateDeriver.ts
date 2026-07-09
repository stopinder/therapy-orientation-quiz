import type { InvestigationFacts, InvestigationState } from './types';

export function deriveState(facts: InvestigationFacts): InvestigationState {
  if (facts.usableEvidenceCount >= 2 && facts.recognitionConfirmed && facts.relationshipCandidateExists && !facts.contradictionPresent) {
    return 'discovery_ready';
  }

  if (facts.usableEvidenceCount >= 2 && facts.relationshipCandidateExists) {
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
