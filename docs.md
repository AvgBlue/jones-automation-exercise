# File Structure

This document describes the recommended file structure for the Jones Automation Exercise, inspired by the XM Cyber E2E project.

## Root Level

- `package.json` - Project configuration and scripts for the legacy automation, Playwright tests, browser installation, TypeScript checking, and Allure reporting
- `tsconfig.json` - TypeScript type-check configuration for `playwright.config.ts` and `tests/**/*.ts` using bundler-compatible ESM resolution
- `playwright.config.ts` - Chromium test runner configuration, compact video recording and console/Allure reporters, limited to `tests/ui`
- `pnpm-lock.yaml` - Lock file for pnpm package manager
- `Jones_Automation_Exercise.md` - Assignment reference document
- `AGENTS.md` - Agent instructions for this project
- `docs.md` - This file, documenting the project structure
- `.github/workflows/allure-reports.yml` - CI tests, Allure generation, five-report retention and GitHub Pages deployment; PRs also verify the video without publishing
- `scripts/retain-allure.mjs` - Copy a complete report into the persistent five-run archive and create a redirect to the latest report
- `scripts/check-allure-video.mjs` - Assert a nonempty WebM is embedded in the generated Allure report and measure video/report sizes

## Running the Tests

Install Node.js 22 or later and a compatible pnpm 11 version, then run:

```sh
pnpm install --frozen-lockfile
pnpm run test:install-browsers
pnpm run typecheck
pnpm test
pnpm run report:generate
node scripts/check-allure-video.mjs
pnpm run report:open
pnpm run test:retention
```

`pnpm test` runs Playwright and writes raw Allure files to `allure-results/`. It records a WebM video for every test at 800×450, including successful tests. `pnpm run report:generate` creates the static report at `allure-report/`; `check-allure-video.mjs` checks that a video is embedded and prints the video size, full report size, and a five-report size estimate. `report:open` previews it. `pnpm run test:retention` checks report copying, the five-run limit, reruns and invalid inputs without a browser. The original `pnpm run automation` JavaScript automation is retained. Browser installation is a separate explicit step. The callback test requires the live destination to return HTTP 200 and display the expected thank-you heading; if the live site is broken, the E2E test must fail rather than accepting a 404.

## Allure CI and GitHub Pages

The workflow runs on pushes to `master` and manual runs selected on `master`. It installs frozen dependencies and Chromium, checks TypeScript and the retention script, runs Playwright, generates Allure HTML, verifies the video, and publishes the result to GitHub Pages. Pull requests run the same test, generate the report and measure its video and total size without deploying a public site. A failed Playwright test on `master` still produces and publishes its report; the final CI result remains failed.

**One-time setup:** In the repository's **Settings → Pages**, choose **GitHub Actions** as the Build and deployment source. Check that Pages is available for this private repository on your GitHub plan. **The published report site is publicly accessible by default even though this repository is private, including its screenshots and video recordings.** Do not place passwords, credentials, personally identifiable test data, or sensitive screenshots/videos in reports. If Pages is unavailable or access is unacceptable, do not enable deployment without choosing another host.

The workflow stores the five most recently published complete reports on the generated `allure-reports-store` branch at `runs/<GitHub Actions run ID>/`. A minimal root `index.html` redirects to the latest Allure report; it is not a custom dashboard. The branch's `.retained-runs.json` holds only retention ordering; no separate Allure trend history is maintained. Each new completed report deletes reports beyond the newest five. Previously published per-run links expire when pruned. Compare actual report sizes against the GitHub Pages 1 GB published-site limit before deciding whether to reduce retention to one report.

After a successful Pages deployment, the **GitHub Actions run Summary** displays a clickable **View this run's Allure report** link. It is written through `$GITHUB_STEP_SUMMARY` and does not require opening the job's logs. If deployment fails, the summary states that no live link is available instead of displaying an unverified URL. The workflow serializes publication to protect the archive from concurrent updates.

The workflow uses the repository's Actions-provided `GITHUB_TOKEN` (`contents: write`, `pages: write`, `id-token: write`); no personal access token is needed for the implementation. Pages must still be enabled in repository settings before the first successful publication.

## test-site/

The target application files.

- `index.html` - Main form page snapshot
- `_app.css` - Stylesheet
- `jones-automation.js` - Existing JavaScript automation script

## tests/ui/

Playwright UI tests organized by feature.

- `callback.spec.ts` - Callback-request scenario with named `test.step` phases and independent per-test navigation in `beforeEach`

### tests/ui/models/

Page objects and reusable UI components.

- `CallbackPage.ts` - Callback form interactions and locators
- `ThankYouPage.ts` - Destination page locators and navigation
- `index.ts` - Page-object exports

### tests/ui/keywords/

Small, scenario-specific operations called from tests; not a generic keyword execution engine. Page Objects own locators and basic interactions; keywords combine them with scenario assertions.

- `callback.keywords.ts` - Navigation, form readiness, fill/value checks, employee selection checks, and pre-submit screenshot attachment
- `thankYou.keywords.ts` - Submission and successful confirmation checks (navigation response HTTP 200, destination URL and heading)

### tests/ui/fixtures/

Test data and fixture files.

- `callbackData.ts` - Sample callback form data and employee-count selection

### tests/ui/screenshots/

Generated screenshots from test runs.

- `.gitkeep` - Placeholder for screenshot artifacts

## tests/ci/

- `retain-allure.test.mjs` - Node.js tests for five-report retention and the root redirect, excluded from Playwright discovery

## artifacts/

Playwright-generated test artifacts.

- `.gitkeep` - Placeholder for traces, videos, and reports

## XM Cyber Inspiration

The structure draws from XM Cyber's `tests/ui/` organization:

- `tests/ui/tests/` → This project's `tests/ui/` directly
- `tests/ui/models/` → Reusable page objects and UI components
- `tests/ui/fixtures/` → Test data and fixtures
- `artifacts/` → Generated test outputs

This structure keeps tests organized while avoiding broader complexity from the larger XM Cyber setup (automation-infra and generic keyword engines).
