import { buildFacts } from './factBuilder';
import type { EvidenceItem } from './types';
import { deriveState } from './stateDeriver';
import { applyRules } from './ruleEngine';
import { routeQuestion } from './questionRouter';

export * from './types';
export { buildFacts } from './factBuilder';

export function processInvestigation(evidence: EvidenceItem[]): any {
  const facts = buildFacts(evidence);
  const state = deriveState(facts);
  const rules = applyRules(state, facts);
  const routing = routeQuestion(rules.nextRequiredEvidenceType);

  return {
    currentInvestigationState: state,
    evidenceCompleteness: facts.usableEvidenceCount / 5, // Placeholder
    missingEvidence: facts.missingEvidence,
    nextRequiredEvidenceType: rules.nextRequiredEvidenceType,
    questionPurpose: routing.purpose,
    questionCategory: routing.category,
    discoveryBlocked: rules.discoveryBlocked,
    blockedBecause: rules.blockedBecause,
    wouldUnblock: rules.wouldUnblock,
    ruleId: rules.ruleId
  };
}
