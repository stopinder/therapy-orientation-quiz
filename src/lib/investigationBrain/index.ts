import type { EvidenceItem, DecisionPackage, EvidenceField } from './types';
import { buildFacts, EVIDENCE_PRIORITY } from './factBuilder';
import { deriveState } from './stateDeriver';
import { applyRules } from './ruleEngine';
import { routeQuestion } from './questionRouter';

export * from './types';

export function processInvestigation(evidence: EvidenceItem[]): DecisionPackage {
  const facts = buildFacts(evidence);
  const state = deriveState(facts);
  const rules = applyRules(state, facts);
  const routing = routeQuestion(rules.nextRequiredEvidenceType);

  const missingEvidence = EVIDENCE_PRIORITY.filter(field => {
    const factKey = `has${field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}` as keyof typeof facts;
    return !facts[factKey];
  });

  return {
    currentInvestigationState: state,
    evidenceCompleteness: facts.usableEvidenceCount / EVIDENCE_PRIORITY.length,
    missingEvidence,
    nextRequiredEvidenceType: rules.nextRequiredEvidenceType,
    questionPurpose: routing.purpose,
    questionCategory: routing.category,
    discoveryBlocked: rules.discoveryBlocked,
    blockedBecause: rules.blockedBecause,
    wouldUnblock: rules.wouldUnblock,
    ruleId: rules.ruleId
  };
}
