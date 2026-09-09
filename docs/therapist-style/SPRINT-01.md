# Sprint 01 — What kind of therapist are you?

Status: foundation draft implemented on `feature/therapist-style-reflection`; not wired into a route, not deployed, tests not yet executed by the project-manager session.

## Product decision

A one-off optional reflective experience for qualified or trainee therapists. Launch from Helios Reflect, enter only the quiz, read a thoughtful report, return to Helios, and choose whether to keep it and whether it may inform future private reflection. No marketing page, course funnel, email gate, client record or supervision insertion.

This is not a competence assessment, diagnosis, modality recommendation or validated psychometric instrument.

Architecture decision: `stopinder/mindworx-architecture/05-Decisions/2026-09-09-Therapist-Style-Reflection.md`.

## Implemented foundation

- `src/quiz/therapist/questions.js`: 15 draft scenarios, four substantive choices plus an unscored context-dependent choice. No free-text client input.
- `dimensions.js`: versioned six-dimensional editorial model, theme definitions and fixed disclaimer.
- `scoring.js`: validated answer IDs, actual attainable maxima for each pole, explicit evidence coverage and mixed-signal accounting. No winner/default therapist type.
- `buildTherapistProfile.js`: deterministic qualitative profile with evidence IDs. No names, email, client information, raw scores or confidence estimates in the model profile.
- `reportContract.js`: structured report schema and bounded output/evidence validation. Structural validity is not clinical/content validity.
- `reportInstructions.js`: one coherent narrative request derived from the canonical profile. This does not make a network call.
- `__tests__/therapistStyle.test.js`: content integrity, bounds, deterministic ordering, sparse/context-only answers, cancellation, multi-dimension contributions and malformed-report tests.

All content, weights and wording thresholds are editorial draft rules. They require review and synthetic-fixture testing, not claims of validation. The uploaded example report was not available in the material inspected for this implementation; its specific tone/depth still needs comparison before release.

## Refinements to the earlier proposal

1. `therapeuticAim` is change-focused ↔ understanding-focused, not understanding/relationship-focused. Relationship attention is a separate evidence-linked theme. These concepts must not be conflated.
2. Comfort with uncertainty, diagnostic stance and relationship to expertise are not inferred merely from a collaborative score. Explicit repeated answer evidence is required; the model may not invent additional dimensions.
3. Keep the current `/investigation-starter`, its existing API and unrelated landing/course journeys untouched during this sprint. Add `/therapist-style` as the isolated quiz-only route, then have Helios deep-link there. No global gateway bypass.
4. Saving a report and allowing its use in mapping are separate choices. Do not save automatically and present a misleading “Keep” button afterwards.
5. Reusing permanent reflection storage does not prove that no migration is needed. Expiring single-use handoff state may need a small additional store in the existing infrastructure. Architect review must settle this before implementation.

## UX brief

Editorial, warm, curious and quietly playful — not cartoonish and not a clinical form. Use an ivory base, deep ink, restrained aubergine/teal accents, generous space and a readable serif heading with the existing sans-serif body stack. No new font service is required. The report should feel like a short thoughtful essay with a few recognisable tendencies, not a dashboard.

One scenario at a time. Show “3 of 15”; support Back and Next, retaining answers. Do not move focus or auto-advance on selecting a radio option. Use real radio inputs/fieldsets, visible keyboard focus, reduced-motion support and mobile/zoom checks. Avoid percentage scores, radar charts, badges and confetti. No forced profile label in v1.

Show the disclaimer before the quiz and with the report. Keep failures recoverable, retain answers after a generation failure, provide retry without duplicated charges where feasible, and never replace failure with an invented profile. For little evidence, provide an honest shorter reflection.

Suggested report controls: “Return to Helios”, then in the authenticated container “Keep this reflection” and an unchecked “Let this inform my private reflection map”. Provide “Return without saving”. Saved reports can be viewed, copied/printed and deleted. Browser print support is adequate for v1; do not introduce a PDF service.

## Division of work

Project manager: question/scoring/report foundations, acceptance criteria and review of changes.

Architect Builder GPT: read-only review of the Helios integration boundary, exact routes, ownership, transport, provenance, deletion and any smallest necessary migration. Do not rewrite quiz content or deploy.

WebStorm AI: first run/review these foundation tests, then build the isolated quiz UI using a mocked report adapter. Real AI endpoint and real cross-app handoff follow only after the architecture review. Do not duplicate the scorer.

## WebStorm task 1 — bounded scope

Use the existing `feature/therapist-style-reflection` branch. Check local modifications first; never reset/discard/stash someone else's work automatically. Fetch the remote branch and fast-forward only when safe. Read current files and existing test conventions.

Run:

```sh
npm ci
npm test -- src/quiz/therapist/__tests__/therapistStyle.test.js
npm test
npm run build
```

Report command output and distinguish pre-existing failures from introduced failures. Do not upgrade dependencies just to clear unrelated failures.

Review coverage, reachable bands, all-first-choice, all-context, single-response, mixed-pole and extreme fixtures. Verify that no “professionally correct” answer dominates the content. Do not silently replace content/weights; record proposed changes and rationale.

Then implement a new `TherapistStyleQuizView.vue` and `/therapist-style` route. Inspect `src/App.vue`, router, bootstrap, header/footer and existing `InvestigationStarterView.vue` first. Hide marketing chrome only for the new route via route metadata. Retain the existing framework, auth and unrelated routes. Reuse existing visual primitives and response state patterns without importing legacy ADHD scoring or email capture.

Use an injectable/mocked report adapter during local tests. Do not expose an unauthenticated paid AI endpoint, insert a fake handoff, redirect to a guessed deployment, or show a simulated integration as working. A mock must be visibly marked in development and unavailable in production. No default mock report or hidden production fallback.

Add UI tests appropriate to the current test setup and manually verify mobile layout, keyboard operation, focus, previous answers, errors and reduced motion. Return changed files, actual test results, screenshots where available and unresolved integration dependencies. Do not merge to main, deploy, change secrets, apply migrations or write production records.

## Follow-on delivery gates

A. Core: tests pass; content review and narrative fixtures reviewed.
B. UI: isolated quiz route and pleasant accessible flow; existing routes unchanged.
C. API: verified launch/auth, server recomputation from answer IDs, one schema-constrained model call, response validation, refusal/truncation/timeout handling, rate limits, request bounds, no report/token logging, and deterministic non-AI limitations fallback clearly labelled.
D. Handoff: fixed origins, account/state binding, expiration, replay defence, transactionally idempotent import and failure recovery. No report, email, auth session token or user-supplied profile in URL parameters.
E. Helios: explicit keep/use controls, therapist-only source record, source-aware reader/writer, mapping exclusion rules and deletion propagation.
F. Preview sign-off before any production change. A source inspection or passing unit tests is not end-to-end verification.

## Release tests

- Direct quiz entry from Helios reaches no landing page, gateway, course or email gate.
- Invalid, expired, replayed or wrong-account handoff cannot import or generate a report.
- Unknown answer/version and malformed AI response fail safely.
- Return cancellation and browser refresh do not create a permanent reflection.
- Repeated callback/Keep clicks create at most one saved result.
- Save-only does not feed mapping; explicit permission does; revocation stops future use.
- Cross-therapist read/write/delete are rejected.
- No client/session link, supervision selection, clinical output or routine export leakage.
- Quiz-derived content is not counted as therapist-authored mapped observations.
- Delete removes active source/context and invalidates derived caches; a concurrent generation cannot reintroduce deleted context.
- Existing landing, investigation, course and authentication flows still work.
