import { buildFacts } from './factBuilder';
import type { EvidenceItem, DecisionPackage } from './types';
import { applyRules } from './ruleEngine';

export * from './types';
export { buildFacts } from './factBuilder';

export function processInvestigation(evidence: EvidenceItem[]): DecisionPackage {
  const facts = buildFacts(evidence);
  const decision = applyRules(facts);

  return decision;
}
