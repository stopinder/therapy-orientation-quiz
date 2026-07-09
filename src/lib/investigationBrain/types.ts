export type InvestigationState =
  | 'possible_investigation'
  | 'active_investigation'
  | 'evidence_growing'
  | 'relationship_emerging'
  | 'discovery_ready';

export type EvidenceField =
  | 'real_example'
  | 'situation'
  | 'starting_point'
  | 'shift'
  | 'action'
  | 'outcome'
  | 'recurrence'
  | 'recognition'
  | 'contrast'
  | 'confirmation';

export interface EvidenceItem {
  id: string;
  situation: string;
  startingPoint: string;
  shift: string;
  action: string;
  outcome: string;
  recurrenceSignal: string;
  recognition: boolean;
  contradiction: boolean;
  createdAt: number;
}

export type EvidenceCompleteness = 'incomplete' | 'partial' | 'usable' | 'strong';

export interface DecisionPackage {
  state: InvestigationState;
  evidenceCompleteness: EvidenceCompleteness;
  nextEvidenceType: EvidenceField | null;
  questionCategory: string | null;
  questionPurpose: string | null;
  discoveryBlocked: boolean;
  blockedBecause: string | null;
  wouldUnblock: string | null;
  ruleId: string;
}

export interface InvestigationFacts {
  evidenceCount: number;
  usableEvidenceCount: number;
  strongEvidenceCount: number;
  latestEvidenceCompleteness: EvidenceCompleteness;
  missingEvidence: string[];
  repeatedElements: string[];
  relationshipCandidateExists: boolean;
  recognitionConfirmed: boolean;
  contradictionPresent: boolean;
}
