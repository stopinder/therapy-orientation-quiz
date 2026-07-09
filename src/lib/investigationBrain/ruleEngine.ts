import type { InvestigationFacts, InvestigationState, EvidenceField, DecisionPackage, EvidenceCompleteness } from './types';
import { deriveState } from './stateDeriver';
import { routeQuestion } from './questionRouter';

export interface Rule {
  id: string;
  priority: number;
  condition: (facts: InvestigationFacts) => boolean;
  decision: (facts: InvestigationFacts) => Omit<DecisionPackage, 'ruleId' | 'state' | 'questionCategory'>;
}

const rules: Rule[] = [
  {
    id: 'RULE_001',
    priority: 10,
    condition: (facts) => facts.evidenceCount === 0,
    decision: (facts) => ({
      evidenceCompleteness: 'incomplete',
      nextEvidenceType: 'real_example',
      questionPurpose: 'collect_initial_evidence',
      discoveryBlocked: true,
      blockedBecause: 'No evidence provided',
      wouldUnblock: 'Provide a real example'
    })
  },
  {
    id: 'RULE_002',
    priority: 20,
    condition: (facts) => facts.missingEvidence.includes('situation'),
    decision: (facts) => ({
      evidenceCompleteness: facts.latestEvidenceCompleteness,
      nextEvidenceType: 'situation',
      questionPurpose: 'clarify_situation',
      discoveryBlocked: true,
      blockedBecause: 'Latest evidence is missing a situation',
      wouldUnblock: 'Describe the situation'
    })
  },
  {
    id: 'RULE_003',
    priority: 30,
    condition: (facts) => facts.missingEvidence.includes('starting_point'),
    decision: (facts) => ({
      evidenceCompleteness: facts.latestEvidenceCompleteness,
      nextEvidenceType: 'starting_point',
      questionPurpose: 'clarify_starting_point',
      discoveryBlocked: true,
      blockedBecause: 'Latest evidence is missing a starting point',
      wouldUnblock: 'Describe the starting point'
    })
  },
  {
    id: 'RULE_004',
    priority: 40,
    condition: (facts) => facts.missingEvidence.includes('shift'),
    decision: (facts) => ({
      evidenceCompleteness: facts.latestEvidenceCompleteness,
      nextEvidenceType: 'shift',
      questionPurpose: 'clarify_shift',
      discoveryBlocked: true,
      blockedBecause: 'Latest evidence is missing a shift',
      wouldUnblock: 'Describe the shift'
    })
  },
  {
    id: 'RULE_005',
    priority: 50,
    condition: (facts) => facts.missingEvidence.includes('action'),
    decision: (facts) => ({
      evidenceCompleteness: facts.latestEvidenceCompleteness,
      nextEvidenceType: 'action',
      questionPurpose: 'clarify_action',
      discoveryBlocked: true,
      blockedBecause: 'Latest evidence is missing an action',
      wouldUnblock: 'Describe the action'
    })
  },
  {
    id: 'RULE_006',
    priority: 60,
    condition: (facts) => facts.missingEvidence.includes('outcome'),
    decision: (facts) => ({
      evidenceCompleteness: facts.latestEvidenceCompleteness,
      nextEvidenceType: 'outcome',
      questionPurpose: 'clarify_outcome',
      discoveryBlocked: true,
      blockedBecause: 'Latest evidence is missing an outcome',
      wouldUnblock: 'Describe the outcome'
    })
  },
  {
    id: 'RULE_007',
    priority: 70,
    condition: (facts) => facts.usableEvidenceCount < 2,
    decision: (facts) => ({
      evidenceCompleteness: 'partial',
      nextEvidenceType: 'recurrence',
      questionPurpose: 'find_second_example',
      discoveryBlocked: true,
      blockedBecause: 'Need at least two usable examples',
      wouldUnblock: 'Provide another example'
    })
  },
  {
    id: 'RULE_008',
    priority: 80,
    condition: (facts) => facts.relationshipCandidateExists && !facts.recognitionConfirmed,
    decision: (facts) => ({
      evidenceCompleteness: 'usable',
      nextEvidenceType: 'recognition',
      questionPurpose: 'confirm_recognition',
      discoveryBlocked: true,
      blockedBecause: 'Pattern recognition not confirmed',
      wouldUnblock: 'Confirm the pattern'
    })
  },
  {
    id: 'RULE_009',
    priority: 90,
    condition: (facts) => facts.relationshipCandidateExists && facts.recognitionConfirmed && facts.contradictionPresent,
    decision: (facts) => ({
      evidenceCompleteness: 'strong',
      nextEvidenceType: 'contrast',
      questionPurpose: 'resolve_contradiction',
      discoveryBlocked: true,
      blockedBecause: 'Contradiction present',
      wouldUnblock: 'Resolve the contradiction'
    })
  },
  {
    id: 'RULE_010',
    priority: 100,
    condition: (facts) => facts.usableEvidenceCount >= 2 && facts.relationshipCandidateExists && facts.recognitionConfirmed && !facts.contradictionPresent,
    decision: (facts) => ({
      evidenceCompleteness: 'strong',
      nextEvidenceType: null,
      questionPurpose: null,
      discoveryBlocked: false,
      blockedBecause: null,
      wouldUnblock: null
    })
  }
];

export function applyRules(facts: InvestigationFacts): DecisionPackage {
  const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);
  const state = deriveState(facts);
  
  for (const rule of sortedRules) {
    if (rule.condition(facts)) {
      const decision = rule.decision(facts);
      return {
        ...decision,
        state,
        questionCategory: routeQuestion(decision.nextEvidenceType),
        ruleId: rule.id
      };
    }
  }

  // Default fallback if no rule matches (should not happen with complete ruleset)
  return {
    state,
    evidenceCompleteness: 'incomplete',
    nextEvidenceType: null,
    questionCategory: null,
    questionPurpose: null,
    discoveryBlocked: true,
    blockedBecause: 'No matching rule',
    wouldUnblock: null,
    ruleId: 'RULE_FALLBACK'
  };
}
