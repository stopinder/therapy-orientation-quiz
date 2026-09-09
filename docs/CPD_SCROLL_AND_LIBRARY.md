# CPD selection scrolling and private-library handoff

## Decision
Restore the continuous question list with automatic next-question scrolling after a click/tap. Keep progress sticky within the current scroll container, measure its height and offset targets so headings remain visible. Keyboard radio navigation does not automatically change focus; Continue remains available. Reduced-motion preferences and an explicit scrolling toggle are respected. Editing from Review does not auto-jump away. Choosing the last answer scrolls to Review; it does not submit to AI or save anything.

Keep **Save reflection as text** and offer **Save to my reflection library** when mounted inside the authenticated host. The component accepts a `saveToLibrary(snapshot)` callback and emits `open-library`. The standalone preview has no authenticated library and therefore explains the limitation rather than showing a false Save success. No localStorage persistence, new login or credentials are introduced.

`snapshot.js` captures the report once with a stable UUID, browser completion time (explicitly distinguished from database save time), selected answer IDs, deterministic interpretation, displayed text, question/scoring/interpretation versions and provenance. Unknown AI prompt/model metadata is explicitly null rather than fabricated. Save retries must use the same snapshot UUID; changed answers create a new snapshot. Consumers must preserve source choices, inference and authored/AI text as distinct fields.

Target integration: a native Vue component in `helio-therapist` under existing Reflect/CPD navigation, with a host-owned save adapter using existing `private_reflections.body` and `workspace_content` JSONB. No iframe, token exchange, new schema or cross-origin clinical-data transfer. The host adapter must confirm the authenticated user, enforce ownership through the ordinary RLS client, avoid overwriting earlier snapshots, and return success only after persistence is confirmed. Existing supervision inclusion is not enabled by saving.

Saving prepares evidence for a future continuity engine; no engine is added or invoked. A future prompt must select authorised snapshots explicitly, respect version compatibility and distinguish changed answers from measured progress. Do not populate the existing reflectiveMap fields with quiz-derived findings.

## Files
- `src/views/TherapistQuizView.vue`: scrolling list, sticky progress, optional host save, independent text download.
- `src/quiz/therapist/snapshot.js`: dated, versioned, validated snapshot and export text.
- `src/quiz/therapist/__tests__/snapshot.test.js`: snapshot validation and provenance.
- `scripts/check-cpd-browser.mjs`: actual label-click smooth scrolling, sticky-header offsets, keyboard/reduced-motion completion and fallback. Network/provider replies are simulated.

The supplied questions, weights and interpretation rules are unchanged. Production has not been promoted. Verify the workflow on the actual commit. Native-host saving requires a separate host-app draft and live authenticated acceptance; standalone preview success is not evidence of database persistence.
