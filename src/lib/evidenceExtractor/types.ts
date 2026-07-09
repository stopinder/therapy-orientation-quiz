import type { EvidenceItem } from '../investigationBrain/types';

export type ExtractedEvidence = Partial<Pick<EvidenceItem, 'situation' | 'startingPoint' | 'shift' | 'action' | 'outcome'>>;

export interface ExtractionMetadata {
  extractionConfidence: Record<keyof ExtractedEvidence, number>;
  extractedFromMessageId?: string;
  notes?: string;
}

export interface ExtractionResult {
  evidence: ExtractedEvidence;
  metadata: ExtractionMetadata;
}
