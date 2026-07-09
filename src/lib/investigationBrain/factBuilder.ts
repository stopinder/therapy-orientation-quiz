import type { EvidenceItem, InvestigationFacts, EvidenceCompleteness } from './types';

function getCompleteness(item: EvidenceItem): EvidenceCompleteness {
  if (!item.situation || item.situation.trim().length === 0) {
    return 'incomplete';
  }

  const fields = [item.situation, item.shift, item.action, item.outcome];
  const missingFields = fields.filter(f => !f || f.trim().length === 0);

  if (missingFields.length > 0) {
    return 'partial';
  }

  if (item.recurrenceSignal || item.recognition) {
    return 'strong';
  }

  return 'usable';
}

function getMissingFields(item: EvidenceItem): string[] {
  const missing: string[] = [];
  if (!item.situation) missing.push('situation');
  if (!item.shift) missing.push('shift');
  if (!item.action) missing.push('action');
  if (!item.outcome) missing.push('outcome');
  return missing;
}

export function buildFacts(evidence: EvidenceItem[]): InvestigationFacts {
  const sortedEvidence = [...evidence].sort((a, b) => b.createdAt - a.createdAt);
  const latestItem = sortedEvidence[0];

  const evidenceCount = evidence.length;
  let usableEvidenceCount = 0;
  let strongEvidenceCount = 0;
  let recognitionConfirmed = false;
  let contradictionPresent = false;

  const completenessList = evidence.map(getCompleteness);
  usableEvidenceCount = completenessList.filter(c => c === 'usable' || c === 'strong').length;
  strongEvidenceCount = completenessList.filter(c => c === 'strong').length;

  recognitionConfirmed = evidence.some(e => e.recognition);
  contradictionPresent = evidence.some(e => e.contradiction);

  let latestEvidenceCompleteness: EvidenceCompleteness = 'incomplete';
  let missingEvidence: string[] = ['real_example'];

  if (latestItem) {
    latestEvidenceCompleteness = getCompleteness(latestItem);
    missingEvidence = getMissingFields(latestItem);
  }

  // Repeated element detection
  const repeatedElements: string[] = [];
  const fieldsToTrack: (keyof EvidenceItem)[] = [
    'situation',
    'startingPoint',
    'shift',
    'action',
    'outcome',
    'recurrenceSignal'
  ];

  if (evidence.length >= 2) {
    fieldsToTrack.forEach(field => {
      const values = new Set<string>();
      for (const item of evidence) {
        const val = item[field];
        if (typeof val === 'string' && val.trim().length > 0) {
          if (values.has(val.trim())) {
            if (!repeatedElements.includes(field)) {
              repeatedElements.push(field);
            }
          }
          values.add(val.trim());
        }
      }
    });
  }

  return {
    evidenceCount,
    usableEvidenceCount,
    strongEvidenceCount,
    latestEvidenceCompleteness,
    missingEvidence,
    repeatedElements,
    relationshipCandidateExists: repeatedElements.length > 0,
    recognitionConfirmed,
    contradictionPresent
  };
}
