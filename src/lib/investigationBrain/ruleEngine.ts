import type { InvestigationFacts, InvestigationState, EvidenceField } from './types';
import { EVIDENCE_PRIORITY } from './factBuilder';

export interface RuleResult {
  nextRequiredEvidenceType: EvidenceField | null;
  discoveryBlocked: boolean;
  blockedBecause: string | null;
  wouldUnblock: string | null;
  ruleId: string;
}

export function applyRules(state: InvestigationState, facts: InvestigationFacts): RuleResult {
  const missingInPriority = EVIDENCE_PRIORITY.filter(field => {
    const factKey = `has${field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}` as keyof InvestigationFacts;
    return !facts[factKey];
  });

  // Discovery Blocking Logic
  let discoveryBlocked = true;
  let blockedBecause: string | null = null;
  let wouldUnblock: string | null = null;

  if (facts.usableEvidenceCount < 2) {
    blockedBecause = 'Need at least two usable evidence items';
    wouldUnblock = 'Provide another usable example';
  } else if (!facts.hasRepeatedRelationshipCandidate) {
    blockedBecause = 'Need a repeated relationship candidate';
    wouldUnblock = 'Identify a recurring pattern';
  } else if (!facts.hasRecognition) {
    blockedBecause = 'Recognition is not confirmed';
    wouldUnblock = 'Confirm if you recognize this pattern';
  } else if (facts.hasUnresolvedContradiction) {
    blockedBecause = 'There is an unresolved contradiction';
    wouldUnblock = 'Resolve the contradiction';
  } else if (!facts.canLinkDiscoveryToEvidence) {
    blockedBecause = 'Discovery cannot be linked to evidence';
    wouldUnblock = 'Connect your finding to specific examples';
  } else {
    discoveryBlocked = false;
  }

  // Determine next required evidence based on state and missing fields
  let nextRequired: EvidenceField | null = missingInPriority[0] || null;
  let ruleId = `RULE_${state.toUpperCase()}`;

  // Specific overrides based on requirements
  if (facts.evidenceCount === 0) {
    nextRequired = 'real_example';
    ruleId = 'RULE_NO_EVIDENCE';
  } else if (facts.evidenceCount === 1 && facts.allEvidence[0].isVague) {
    nextRequired = 'situation';
    ruleId = 'RULE_VAGUE_FIRST_EVIDENCE';
  } else if (facts.usableEvidenceCount === 1 && state === 'evidence_growing') {
    nextRequired = 'recurrence';
    ruleId = 'RULE_ONE_USABLE_EXAMPLE';
  } else if (facts.usableEvidenceCount >= 2 && !facts.hasRecognition && state === 'relationship_emerging') {
    nextRequired = 'recognition';
    ruleId = 'RULE_TWO_EXAMPLES_NEED_RECOGNITION';
  }

  return {
    nextRequiredEvidenceType: nextRequired,
    discoveryBlocked,
    blockedBecause,
    wouldUnblock,
    ruleId
  };
}
