# Therapist style — UI slice 01

## Scope

The isolated `/therapist-style` route is implemented on `feature/therapist-style-reflection`. No main merge, live AI endpoint, handoff, saving, database migration or production deployment is included.

The Architect Builder review supplied on 2026-09-09 recommends a dedicated therapist-owned artifact table within the existing Helios Supabase project. That is an integration proposal, not a dependency of this UI slice. No storage or identity contract has been implemented here.

## Preservation

- The seven original foundation files (including their tests), question text, weights, scoring rules and report contract are unchanged.
- Existing investigation, landing, course, gateway and authentication behaviour is retained.
- Only the new route has `meta.standalone`; `App.vue` hides its existing public header for that metadata. PublicFooter remains where existing pages use it and is not imported into the new route.
- Authentication bootstrap is unchanged. Development still needs the existing public Supabase environment configuration to start the SPA; the browser verifier uses dummy values and blocks external requests.
- The work was performed through GitHub, not inside the user's WebStorm checkout. The user's local working tree could not be inspected or changed. No reset, stash, force-push or destructive sync was used against that checkout.
- A branch-specific `git.deploymentEnabled` rule in `vercel.json` disables automatic deployment of this unfinished feature branch. Rewrites are unchanged. No production setting or secret was edited.

## Files

- `src/views/TherapistStyleQuizView.vue`: responsive editorial UI, intro, one-scenario form, progress, review, loading, error/retry and escaped structured report sections. Native radios, keyboard focus, skip link, reduced motion, fixed disclaimer.
- `src/quiz/therapist/ui/useTherapistStyleQuiz.js`: disposable answer/navigation state, explicit generation, contract validation, timeout, cancellation and stale-response protection. No persistence/network.
- `src/quiz/therapist/ui/reportAdapter.js`: injection symbol and explicit development-only adapter boundary. No adapter by default; all production adapters disabled for this slice.
- `src/quiz/therapist/ui/developmentReportAdapter.js`: opt-in layout sample and deliberate first-request-failure simulation. Not an AI report or a personalised interpretation. Dynamically imported only inside a compile-time development guard.
- `src/router/therapistStyleRoute.js`: independent lazy-loaded route.
- `src/router/index.js`: adds that route and uses non-animated initial scrolling for it. Existing guards are unchanged.
- `src/App.vue`: route-aware public header only; existing auth lifecycle retained.
- `src/quiz/therapist/__tests__/therapistStyleUI.test.js`: state, cancellation, recovery, malformed output, production boundary, isolated route and SSR intro tests.
- `scripts/verify-therapist-style-ui.mjs`: Chromium desktop/mobile/keyboard/reflow/reduced-motion checks, existing-route checks, production fixture exclusion and screenshots. Uses a temporary build folder and blocks all external/application API requests.
- `.github/workflows/therapist-style-ui.yml`: independent clean-runner foundation-baseline and current checks. No deployment, credentials persisted in checkout, secrets or production data. Browser tooling is installed separately in runner temporary storage; project dependencies/lockfile are unchanged.

## Verification before UI changes

GitHub Actions run: 34359597105.
Baseline: `5fd68b8ba842cbc295ee72bec9525851e4f60178`.
Runner: Ubuntu 24.04, Node 22.23.2, npm 10.9.8.

- `npm ci`: passed (164 packages added).
- `npm test -- src/quiz/therapist/__tests__/therapistStyle.test.js`: 14 passed.
- `npm test`: 65 passed across 9 files.
- `npm run build`: passed, Vite 7.3.3, 137 modules.
- Browser test: skipped at baseline because the UI did not yet exist.

Pre-existing warnings: npm reported 9 dependency vulnerabilities (2 low, 3 moderate, 4 high); Vite warned about mixed static/dynamic imports of the entitlements store. Dependencies were not upgraded. These warnings should be reviewed separately, not hidden or described as fixed by this UI.

## Verification after UI changes

This commit triggers the full workflow with the browser verifier present. Record actual resulting run/job outcomes in the PR; do not infer that authored tests have passed. Screenshots/results are uploaded as a short-lived Actions artifact.

Automated geometry/focus checks and screenshot capture are not a human visual review, screen-reader review or live integration test. Real model output, authenticated return, Keep, mapping permission and delete remain outside this slice.

## Local preview

Preserve local work first. Fetch/switch/fast-forward the existing branch only when safe; never reset/discard local changes to follow this document.

Run the existing commands:

```sh
npm ci
npm test -- src/quiz/therapist/__tests__/therapistStyle.test.js
npm test
npm run build
npm run dev
```

Open `/therapist-style` on the local Vite origin. The page has no default report adapter. To exercise report rendering, open **Development preview tools** and select **Enable sample report**. Optionally check **Simulate a failed first report request** before enabling it.

The real report button is unavailable in production. Query parameters do not enable mocks. There is no fake Return/Save/Keep control. Refresh/leaving clears the in-memory answers.

The browser verifier requires Playwright externally installed. In CI it uses a pinned temporary installation. A developer with Playwright already available can run `node scripts/verify-therapist-style-ui.mjs`, or set `PLAYWRIGHT_MODULE` to that installation's absolute `playwright/index.mjs` path. This is optional local tooling, not a new runtime dependency.

## Remaining integration gates

Authenticated launch/account binding; verified stable origins; replay-safe handoff; server-side scoring from answer IDs; protected single-call AI endpoint; report-quality review; source-specific persistence; explicit Keep/mapping permission; revoke/delete. The supplied Architect review informs that next slice, not an automatic expansion of this one.
