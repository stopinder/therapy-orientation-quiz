/** Injection seam for UI tests and explicit local preview; no network adapter yet. */
export const THERAPIST_REPORT_ADAPTER = Symbol('therapist-style-report-adapter');
export const REPORT_UNAVAILABLE_MESSAGE = 'Report generation is not connected in this build. Your answers remain on this page while you review them.';

/**
 * This UI slice deliberately admits no production report adapter. The authorised
 * server adapter belongs to the later integration slice, not to a mock fallback.
 */
export function resolveReportAdapter(adapter, development = import.meta.env.DEV) {
  if (!development || adapter?.kind !== 'development-mock' || typeof adapter.generate !== 'function') return null;
  return adapter;
}
