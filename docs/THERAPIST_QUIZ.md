# What kind of therapist are you? — replacement prototype

## Decision

The previous ADHD / behavioural-investigation quiz is redundant. This prototype **replaces its user-facing experience**, rather than adding another product alongside it. It reuses the existing Vue 3 / Vite / Vue Router / Pinia / Vercel foundation, not the previous questions, traits, category mapping, prompts or investigation-report configuration.

Work is on `therapist-style-replacement`, based on main commit `1e767658e4d931bfbddaa346d9c57c6a3d73895c`. Do not merge or promote a deployment until the review items below are complete.

The homepage, `/therapist-quiz`, and the old questionnaire entry links lead to the replacement. The legacy programme/account UI is not mounted by this prototype; unmatched former routes return to the new quiz. The old report and email-capture endpoints return HTTP 410. Existing database records have not been deleted, migrated or overwritten. Other legacy API files and historical source files remain in the repository for a separate, explicit retirement review; the new questionnaire does not import or call them. In particular, do not assume that removing the old UI has disabled every historical backend endpoint.

## User flow

Introduction and reflective-exercise acknowledgement → 15 scenarios → review/edit choices → either a local question-based reflection or an explicitly requested AI-written reflection → nine report sections → optional plain-text download.

No account, email gate, client information, free-text response, database table or new package dependency is introduced. Answers are kept in page memory only. Refreshing loses them. No browser persistence or session replay is used by the new entrypoint. The previous global Clarity and checkout scripts have been removed from `index.html` in this branch.

## Files

| File | Responsibility |
| --- | --- |
| `src/quiz/therapist/questions.js` | Fifteen new clinical scenarios, stable answer IDs and provisional weights. |
| `src/quiz/therapist/content.js` | Six dimension definitions, authored possible strengths/trade-offs, report headings and fixed boundaries. |
| `src/quiz/therapist/scoring.js` | Validate selections and calculate deterministic directional evidence. |
| `src/quiz/therapist/buildResult.js` | Build the report input, retain counter-evidence, derive limited themes and provide fixed-wording fallback. |
| `server/therapistReport.js` | New report-writing instructions, strict JSON schema, response checks and one provider call. |
| `api/therapist-report.js` | Validate request, recompute result server-side, enforce consent/version/size/origin checks, gate AI availability and return fallback on failure. |
| `src/views/TherapistQuizView.vue` | Accessible selection, review, consent, loading/errors, actual narrative display and text export. |
| `src/router/index.js`, `src/App.vue`, `src/main.js` | Replace the old entry flow and remove automatic account hydration. |
| `api/expand-report-v2/index.js`, `api/capture-email/index.js` | Retire the previous questionnaire's report and capture routes. |
| `index.html` | New title/description; no replay, checkout or external-font scripts; noindex while a draft. |
| `vercel.json` | Keep existing rewrites; allow 60 seconds for the new report endpoint. |
| `src/quiz/therapist/__tests__/therapist.test.js` | Content, calculation, input/output, consent, privacy-boundary, failure and wiring checks. |
| `.github/workflows/therapist-quiz.yml` | Run focused tests and production build on pushes to this review branch. |

## Question map

Read the full questions in `src/quiz/therapist/questions.js`; this is a review map, not a validated scale blueprint.

| ID | Situation | Dimensions |
| --- | --- | --- |
| q01 | Being asked for advice | Direction-setting; immediate aim |
| q02 | A request for a diagnosis | Direction-setting; meaning-making |
| q03 | An emotionally intense session | Organisation; working mode |
| q04 | A fluent intellectual explanation | Working mode; meaning-making |
| q05 | A prolonged silence | Direction-setting; working mode |
| q06 | Being credited for change | Time emphasis; meaning-making |
| q07 | A strong but uncertain hypothesis | Organisation; meaning-making |
| q08 | A request for exercises | Organisation; direction-setting |
| q09 | Working within a time limit | Organisation; time emphasis |
| q10 | A pattern between therapist and client | Direction-setting; time emphasis |
| q11 | Recurring apprehension | Working mode; time emphasis |
| q12 | Understanding without much movement | Working mode; immediate aim |
| q13 | A session without an urgent issue | Organisation; immediate aim |
| q14 | Improvement without an origin story | Time emphasis; immediate aim |
| q15 | A mismatch in the work | Meaning-making; immediate aim |

Each question has four clinically plausible offers, with both directions available for each relevant dimension. A fifth “I cannot choose a usual response” option is missing evidence, not a middle score. Options are displayed with a stable rotation, but their IDs and scoring do not change. The complete set offers five opportunities per dimension. This arrangement does not establish reliability, validity or independence of dimensions; cognitive interviews and clinical/editorial review are still needed.

## Calculation rules

Weights are provisional editorial values (-2 or +2 on two dimensions per substantive answer), not psychological measurements. For each dimension, sum selected weights and divide by the sum of the maximum absolute weight available on its answered items. Context/uncertain answers are excluded from numerator and denominator. At least three usable items are required before describing a tendency.

An internal absolute position of 0.25 or less is treated as mixed/no lean. These thresholds are initial content rules, not validated cut-offs. Both directional and counter-directional evidence are retained. Equally prominent tendencies remain equal: no arbitrary tie-break assigns a therapist type. All uncertain responses produce insufficient evidence, never a default profile. The user is not shown numeric positions, percentiles or clinical confidence labels.

Up to two cross-scenario contrasts become reflective questions, not declarations of contradiction. Structure plus client-led work is explicitly treated as potentially complementary. Themes concerning diagnosis, hypotheses and receiving credit are limited to the specific selected approach; they do not infer ideology, virtue, personality or tolerance of uncertainty.

## AI contract

The browser sends only `{ quizVersion, answers, consent: true }`. It cannot supply a profile, custom prompt, name, email or other extra fields. The server recomputes the structured result from the same content rules. The model receives that result, authored evidence and approved-in-code writing instructions, not an unstructured psychological-profiling task.

One Chat Completions request uses `gpt-4.1-mini` by default, with a strict JSON schema for nine sections and evidence IDs. The original app already used this provider/model family, so no SDK or database is added. `THERAPIST_REPORT_MODEL` can select another compatible model only after testing. Response shape, sections, evidence IDs, refusal/truncation, text size and selected prohibited claims are checked. Text is rendered using Vue interpolation, never `v-html`.

A valid schema cannot prove clinical accuracy or prevent every unsupported interpretation. The prose still needs review against deliberately contrasting test profiles. No automated check here establishes clinical validity.

`store: false` is used, and this endpoint does not save to Supabase or log prompts/answers/reports. This is not a claim that the hosting or AI provider retains no data. The UI explains this before an AI request. The existing example report was not available during implementation; the prompt follows the written brief but has not been calibrated against that example.

## AI is off by default

The local, clearly labelled fixed-wording reflection works without any AI credentials. It is not presented as an AI-written report.

For a **protected preview**, configure these server-side Vercel environment variables (never `VITE_` secrets):

```text
OPENAI_API_KEY=<existing server-side key, not committed>
THERAPIST_REPORT_AI_ENABLED=true
```

Optional: `THERAPIST_REPORT_MODEL` and `THERAPIST_APP_ORIGIN` (the exact origin, including protocol; omit for per-preview host matching).

Production additionally requires `THERAPIST_REPORT_PUBLIC_READY=true`. This flag is an administrative acknowledgement, not an automatically verified safeguard. Leave it unset until public abuse controls, costs, privacy information, old-endpoint retirement, clinical/editorial review and actual provider testing are complete.

The in-process limit of three AI requests per minute per apparent client is **only a warm-instance convenience throttle**. It resets across instances and is not sufficient distributed abuse protection. Same-origin checks are also not authentication. Use deployment protection for private trials and a reviewed platform-level WAF/rate policy and provider spend controls before public AI use. Do not add a database merely to score the quiz.

Provider failure, refusal, timeout or malformed output returns a clearly labelled fixed-wording fallback. A browser-network error preserves the choices and allows retry or local reflection. Insufficient evidence skips AI entirely. A successful mocked test does not verify live provider access or Vercel environment settings.

## Checks

```sh
npm ci
npm test -- src/quiz/therapist/__tests__
npm run build
```

These commands test the new isolated flow. Historical investigation tests remain in the repository and are not claimed as a regression suite for the retired product. The workflow uses no production secrets and makes no paid AI calls.

Manual preview checks: keyboard-only selection and focus; narrow-screen layout; changing earlier answers; all-context answers; no-API mode; valid AI mode in a protected preview; forced timeout/fallback; absence of email capture; text download; opening each old entry link; checking network requests for unintended legacy integrations. Build/unit-test success is not a substitute for these browser checks.

## Before merging or launching

1. Review the actual 15 question wordings and both poles of each dimension with therapists; adjust any option that sounds preferable by virtue rather than stance.
2. Supply the example report, then calibrate tone/depth across contrasting, mixed and sparse profiles without copying its conclusions.
3. Run the actual Vercel preview and live-provider checks; confirm protective settings and costs. The draft remains noindex.
4. Confirm retirement of the old programme/account URLs and separately audit/decommission historical API endpoints that remain; do not delete stored user data without an explicit retention decision.
5. Approve the replacement and only then merge/promote. No production deployment or database migration is part of this draft change.

Technical references:
- https://developers.openai.com/api/docs/guides/structured-outputs
- https://vercel.com/docs/functions/configuring-functions/duration
- https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs
