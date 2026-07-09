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
  id?: string;
  type: EvidenceField;
  content: string;
  isUsable: boolean;
  isVague: boolean;
  timestamp: number;
}

export interface DecisionPackage {
  currentInvestigationState: InvestigationState;
  evidenceCompleteness: number; // 0 to 1
  missingEvidence: EvidenceField[];
  nextRequiredEvidenceType: EvidenceField | null;
  questionPurpose: string;
  questionCategory: string;
  discoveryBlocked: boolean;
  blockedBecause: string | null;
  wouldUnblock: string | null;
  ruleId: string;
}

export interface InvestigationFacts {
  evidenceCount: number;
  usableEvidenceCount: number;
  hasRealExample: boolean;
  hasSituation: boolean;
  hasStartingPoint: boolean;
  hasShift: boolean;
  hasAction: boolean;
  hasOutcome: boolean;
  hasRecurrence: boolean;
  hasRecognition: boolean;
  hasContrast: boolean;
  hasConfirmation: boolean;
  hasRepeatedRelationshipCandidate: boolean;
  hasUnresolvedContradiction: boolean;
  canLinkDiscoveryToEvidence: boolean;
  allEvidence: EvidenceItem[];
}
