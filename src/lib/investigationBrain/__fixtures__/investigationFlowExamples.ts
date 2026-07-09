import type { EvidenceItem, EvidenceField, InvestigationState } from '../types';

export interface InvestigationFlowFixture {
  id: string;
  userMessage: string;
  mockExtractedEvidence?: Partial<EvidenceItem>;
  expectedEvidenceFields: (keyof EvidenceItem)[];
  expectedMissingEvidence: string[];
  expectedNextEvidenceType: EvidenceField | null;
  expectedQuestionCategory: string | null;
  expectedState: InvestigationState;
  notes: string;
}

export const investigationFlowExamples: InvestigationFlowFixture[] = [
  {
    id: 'FIXTURE_001',
    userMessage: 'I feel like I am always busy but getting nothing done.',
    mockExtractedEvidence: {
      situation: '' // Explicitly empty to ensure it's detected as missing real_example or situation
    },
    expectedEvidenceFields: [],
    expectedMissingEvidence: ['situation'],
    expectedNextEvidenceType: 'situation',
    expectedQuestionCategory: 'situation_location',
    expectedState: 'active_investigation',
    notes: 'Vague general statement'
  },
  {
    id: 'FIXTURE_002',
    userMessage: 'Yesterday at work I was writing an email and then the phone rang. I checked it and lost my train of thought.',
    mockExtractedEvidence: {
      situation: 'At work',
      startingPoint: 'Writing an email',
      shift: 'Phone rang',
      action: 'Checked phone',
      outcome: 'Lost train of thought'
    },
    expectedEvidenceFields: ['situation', 'startingPoint', 'shift', 'action', 'outcome'],
    expectedMissingEvidence: [],
    expectedNextEvidenceType: 'recurrence',
    expectedQuestionCategory: 'recurrence_collection',
    expectedState: 'evidence_growing',
    notes: 'Concrete task delay with all fields'
  },
  {
    id: 'FIXTURE_003',
    userMessage: 'I was sitting at my desk when my boss walked in.',
    mockExtractedEvidence: {
      situation: 'Sitting at desk',
      shift: 'Boss walked in',
      startingPoint: 'Working' // Added to satisfy RULE_003
    },
    expectedEvidenceFields: ['situation', 'shift', 'startingPoint'],
    expectedMissingEvidence: ['action', 'outcome'],
    expectedNextEvidenceType: 'action',
    expectedQuestionCategory: 'action_detection',
    expectedState: 'active_investigation',
    notes: 'Missing action and outcome'
  },
  {
    id: 'FIXTURE_004',
    userMessage: 'I started cleaning the kitchen, then I saw a bill on the counter and started paying it.',
    mockExtractedEvidence: {
      situation: 'Cleaning the kitchen',
      shift: 'Saw a bill',
      action: 'Started paying it',
      startingPoint: 'Cleaning' // Added to satisfy RULE_003
    },
    expectedEvidenceFields: ['situation', 'shift', 'action', 'startingPoint'],
    expectedMissingEvidence: ['outcome'],
    expectedNextEvidenceType: 'outcome',
    expectedQuestionCategory: 'outcome_detection',
    expectedState: 'active_investigation',
    notes: 'Missing outcome'
  },
  {
    id: 'FIXTURE_005',
    // Representing a state where we already have one usable evidence and just got another one
    userMessage: 'It happened again this morning while I was getting ready.',
    mockExtractedEvidence: {
      situation: 'Repeat',
      shift: 'Thought of something else',
      action: 'Stopped getting ready',
      outcome: 'Late for work',
      startingPoint: 'Getting ready'
    },
    expectedEvidenceFields: ['situation', 'shift', 'action', 'outcome', 'startingPoint'],
    expectedMissingEvidence: [],
    expectedNextEvidenceType: 'recognition',
    expectedQuestionCategory: 'recognition_check',
    expectedState: 'relationship_emerging',
    notes: 'Repeated communication example (requires prepopulated evidence in test)'
  },
  {
    id: 'FIXTURE_006',
    userMessage: 'Yes, I see that I do this every time I am interrupted.',
    mockExtractedEvidence: {
      recognition: true,
      situation: 'Repeat'
    },
    expectedEvidenceFields: ['recognition', 'situation'],
    expectedMissingEvidence: [],
    expectedNextEvidenceType: null,
    expectedQuestionCategory: null,
    expectedState: 'discovery_ready',
    notes: 'User recognition (requires prepopulated evidence in test)'
  },
  {
    id: 'FIXTURE_007',
    userMessage: 'But sometimes I actually find the interruption helpful and I finish faster.',
    mockExtractedEvidence: {
      contradiction: true,
      situation: 'Repeat'
    },
    expectedEvidenceFields: ['contradiction', 'situation'],
    expectedMissingEvidence: [],
    expectedNextEvidenceType: 'recognition', // RULE_008 has priority over RULE_009
    expectedQuestionCategory: 'recognition_check',
    expectedState: 'relationship_emerging', // Still emerging because contradiction blocks ready
    notes: 'Contradiction (requires prepopulated evidence in test)'
  },
  {
    id: 'FIXTURE_008',
    userMessage: 'I’m not sure what happened next.',
    mockExtractedEvidence: {
      situation: '' // Explicitly empty
    },
    expectedEvidenceFields: [],
    expectedMissingEvidence: ['situation'],
    expectedNextEvidenceType: 'situation',
    expectedQuestionCategory: 'situation_location',
    expectedState: 'active_investigation',
    notes: '“I’m not sure”'
  },
  {
    id: 'FIXTURE_009',
    userMessage: 'I just didn’t want to do it so I went to get a coffee instead.',
    mockExtractedEvidence: {
      action: 'Went to get coffee',
      outcome: 'Delayed task',
      situation: '' // Explicitly empty
    },
    expectedEvidenceFields: ['action', 'outcome'],
    expectedMissingEvidence: ['situation'],
    expectedNextEvidenceType: 'situation',
    expectedQuestionCategory: 'situation_location',
    expectedState: 'active_investigation',
    notes: 'Avoidance'
  },
  {
    id: 'FIXTURE_010',
    userMessage: 'I never went back to finish the report.',
    mockExtractedEvidence: {
      outcome: 'Never finished report',
      situation: '' // Explicitly empty
    },
    expectedEvidenceFields: ['outcome'],
    expectedMissingEvidence: ['situation'],
    expectedNextEvidenceType: 'situation',
    expectedQuestionCategory: 'situation_location',
    expectedState: 'active_investigation',
    notes: 'Unfinished loop'
  }
];
