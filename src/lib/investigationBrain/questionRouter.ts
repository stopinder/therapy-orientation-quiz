import type { EvidenceField } from './types';

export interface RouteInfo {
  purpose: string;
  category: string;
}

const ROUTE_MAP: Record<EvidenceField, RouteInfo> = {
  real_example: { purpose: 'Initial anchoring', category: 'Evidence Gathering' },
  situation: { purpose: 'Contextual clarity', category: 'Evidence Gathering' },
  starting_point: { purpose: 'Identifying origins', category: 'Evidence Gathering' },
  shift: { purpose: 'Detecting movement', category: 'Process Analysis' },
  action: { purpose: 'Behavioral mapping', category: 'Process Analysis' },
  outcome: { purpose: 'Result tracking', category: 'Impact Assessment' },
  recurrence: { purpose: 'Pattern verification', category: 'Pattern Discovery' },
  recognition: { purpose: 'Insight confirmation', category: 'Pattern Discovery' },
  contrast: { purpose: 'Boundary definition', category: 'Differentiation' },
  confirmation: { purpose: 'Final validation', category: 'Validation' }
};

export function routeQuestion(nextRequired: EvidenceField | null): RouteInfo {
  if (!nextRequired || !ROUTE_MAP[nextRequired]) {
    return {
      purpose: 'Complete investigation',
      category: 'Conclusion'
    };
  }
  return ROUTE_MAP[nextRequired];
}
