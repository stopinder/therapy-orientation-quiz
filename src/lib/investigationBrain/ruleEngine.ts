import type { InvestigationFacts, InvestigationState, EvidenceField, DecisionPackage, EvidenceCompleteness } from './types';

export interface Rule {
  id: string;
  priority: number;
  condition: (facts: InvestigationFacts) => boolean;
  decision: (facts: InvestigationFacts) => Omit<DecisionPackage, 'ruleId'>;
}

const rules: Rule[] = [
  {
    id: 'RULE_001',
    priority: 10,
    condition: (facts) => facts.evidenceCount === 0,
    decision: (facts) => ({
      state: 'possible_investigation',
      evidenceCompleteness: 'incomplete',
      nextEvidenceType: 'real_example',
      questionCategory: 'starter',
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
      state: 'active_investigation',
      evidenceCompleteness: facts.latestEvidenceCompleteness,
      nextEvidenceType: 'situation',
      questionCategory: 'elaboration',
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
      state: 'active_investigation',
      evidenceCompleteness: facts.latestEvidenceCompleteness,
      nextEvidenceType: 'starting_point',
      questionCategory: 'elaboration',
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
      state: 'active_investigation',
      evidenceCompleteness: facts.latestEvidenceCompleteness,
      nextEvidenceType: 'shift',
      questionCategory: 'elaboration',
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
      state: 'active_investigation',
      evidenceCompleteness: facts.latestEvidenceCompleteness,
      nextEvidenceType: 'action',
      questionCategory: 'elaboration',
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
      state: 'active_investigation',
      evidenceCompleteness: facts.latestEvidenceCompleteness,
      nextEvidenceType: 'outcome',
      questionCategory: 'elaboration',
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
      state: 'evidence_growing',
      evidenceCompleteness: 'partial',
      nextEvidenceType: 'recurrence',
      questionCategory: 'recurrence',
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
      state: 'relationship_emerging',
      evidenceCompleteness: 'usable',
      nextEvidenceType: 'recognition',
      questionCategory: 'pattern',
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
      state: 'relationship_emerging',
      evidenceCompleteness: 'strong',
      nextEvidenceType: 'contrast',
      questionCategory: 'validation',
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
      state: 'discovery_ready',
      evidenceCompleteness: 'strong',
      nextEvidenceType: null,
      questionCategory: null,
      questionPurpose: null,
      discoveryBlocked: false,
      blockedBecause: null,
      wouldUnblock: null
    })
  }
];

export function applyRules(facts: InvestigationFacts): DecisionPackage {
  const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);
  
  for (const rule of sortedRules) {
    if (rule.condition(facts)) {
      const decision = rule.decision(facts);
      return {
        ...decision,
        ruleId: rule.id
      };
    }
  }

  // Default fallback if no rule matches (should not happen with complete ruleset)
  return {
    state: 'possible_investigation',
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
