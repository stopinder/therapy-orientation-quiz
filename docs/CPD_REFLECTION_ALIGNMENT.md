# CPD practice reflection — alignment and completion fix

## Product decision — 9 September 2026

This is an exercise within the main app's continuing professional development experience, not a separate product. The earlier standalone framing in `THERAPIST_QUIZ.md` is superseded by this note. Remove MindWorks branding, marketing header/footer and oversized landing-page presentation. Use the descriptive exercise heading **Your therapeutic stance** under **CPD / Practice reflection**. No replacement logo or sub-brand is introduced.

The separate review branch/deployment is a temporary implementation boundary, not a new product identity. This change does not move code into `helio-therapist`, save to its database or imply that integration is complete.

## Sources inspected

Read-only Notion review:

- Helios Therapist: current product direction (6 September 2026), Reflect navigation and Reflections / Map / Growth context.
  https://app.notion.com/p/3aa7404c23fc80b3a6f0edee34a2adf1
- Clinical Model & Safety: therapist reflections are private professional-development material, separate from client documentation and clinical records; assistance is tentative and therapist-controlled.
  https://app.notion.com/p/3bf7404c23fc816e8691fb400ff120e0
- Professional Development: existing `private_reflections` ownership and explicit supervision inclusion, not a new duplicated supervision store. This feature page was last reviewed in August; the September home-page direction takes precedence for navigation.
  https://app.notion.com/p/0c7a02a415254d03a5aa008429fd6110
- Product & Delivery / Future Ideas & Decisions: distinguish shipped workflow from future integration and deliberate product decisions.

Read-only main-app source inspection at `stopinder/helio-therapist`, commit `7c9ade882f0d57b7b97de5a02c5814530bef3fda`:

- `tailwind.config.js`: semantic surface, action, reflection and type tokens.
- `src/main.css`: actual warm reading surfaces and teal values. This current implementation is preferred over older design notes with different surface values.

No Notion page, main-app source file, production setting or database record is changed in this slice.

## Visual alignment

`src/quiz/therapist/reflection.css` consumes inherited host tokens with local fallbacks, rather than installing a second global theme:

| Role | Host token | Preview fallback |
| --- | --- | --- |
| Canvas | `--surface-canvas` | `#F4F0E7` |
| Quiet answer panels | `--surface-muted` | `#ECE7DD` |
| Main actions | `--action-primary` | `#1D546D` |
| Strong hover | `--surface-sidebar` | `#061E29` |
| Quiet accents | `--border-reflection-tag` | `#5F9598` |
| Selected response | `--surface-reflection` | `#E8F0F2` |
| Text | `--text-primary` | `#20241F` |

The answer panels no longer use near-white fills. Type is reduced from a marketing hero to a workspace heading. Fonts inherit `--font-ui` and `--font-editorial`; no external font request is added. Button hover uses deep teal rather than light dusty teal to keep white labels readable. Scope the stylesheet to the exercise; do not override `:root` or recreate the main app's sidebar/navigation.

## Completion defect and correction

The prior component used a computed count based on `Object.hasOwn(answers, question.id)` against a reactive object. Unlike reading the answer value, that calculation does not subscribe to the proxy's answer-value changes. Evaluating it while empty can leave the cached completion count at zero, which disables the final report actions even after every question is answered.

- New `progress.js` reads and validates each `answers[question.id]` value inside the computed calculation. Added, edited, removed and restored selections invalidate the count.
- The context answer completes a question but remains missing evidence for scoring.
- Continue/Review is not a silent dead button: an unanswered situation produces a visible inline explanation and stays on that question. Selecting a valid response permits navigation.
- A keyed question fieldset and explicit change handler keep the current radio group and recorded answer aligned.
- Editing a response from Review returns directly to Review rather than requiring the remaining questions again.
- **Read reflection** is the primary available action. AI availability and consent are separate, optional controls; absence of AI does not block the authored report.

No questions, weights, scoring thresholds, profile schema, AI prompt, database behaviour or server endpoints are changed by this fix.

## Longitudinal role — target, not implemented here

Treat a completed exercise as a dated reflection snapshot, not a permanent therapist profile. In a later host-app integration, the exercise should sit within the existing Reflect / CPD flow. A therapist should decide whether to save or include it in later reflection, map or supervision work. Review the current private-reflection schema and APIs before choosing any storage mapping; do not invent tables for this prototype.

Preserve distinctions between selected responses, deterministic interpretation, AI-authored narrative and any subsequent therapist amendment. Retain exercise/scoring/prompt versions and date/context for future comparisons. Only compare compatible versions, and never describe score changes as measured growth, competence or deterioration. A change could reflect situation, role, client group or changed interpretation of a question; it cannot establish why the change occurred.

Specialist-authored GPT instructions in the main app may later contextualise explicitly selected snapshots alongside other authorised professional-development material. That is not automatic profiling, supervision or access to client records. The current preview neither reads a therapist's history nor writes to it; the UI says so rather than showing a nonfunctional Save to CPD or Back to main app control.

The original internal exercise identifier is retained for compatibility in this UI-only slice. It is not shown as a separate product brand. Renaming versioned payload fields is a separate migration concern.

## Files in this slice

| File | Change |
| --- | --- |
| `src/views/TherapistQuizView.vue` | Remove product shell; CPD copy; correct completion/navigation; separate optional AI consent from primary reading action. |
| `src/quiz/therapist/progress.js` | Small shared answer-completion helper that tracks reactive value reads. |
| `src/quiz/therapist/reflection.css` | Scoped host-token theme, softer panels and workspace-sized typography. |
| `index.html` | CPD title/description and warm browser theme colour; retain noindex. |
| `src/quiz/therapist/__tests__/progress.test.js` | Regression coverage for initially empty reactive answers, final response, context, edits and missing responses; presentation boundary checks. |
| `scripts/check-cpd-browser.mjs` | Real Chromium checks of desktop/mobile completion, editing, download and optional-AI failure with simulated network replies. |
| `.github/workflows/therapist-quiz.yml` | Run existing and new tests, build and browser checks; install browser tooling outside the app lockfile. |
| `docs/CPD_REFLECTION_ALIGNMENT.md` | Decision, sources, scope and future integration boundary. |

## Verification scope

The browser script uses synthetic answers and mocked report-service availability/failure. It runs the built application in Chromium, including the final question through to all nine report sections; mobile/context completion; an unanswered-question explanation; editing a previous answer; and text export. It checks the expected preview colours, selected text/button contrast samples and horizontal overflow on report views, and rejects unexpected external requests or page errors. This is focused regression coverage, not a full accessibility audit, main-app integration test or live-provider test.

Workflow results must be checked for the actual new commit before claiming a pass. Screenshots are uploaded as short-lived CI artifacts for review. No paid AI call, production credential, main-app authentication or real therapist/client record is used. Production remains unchanged until separately approved and merged.
