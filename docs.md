# Project Structure and Developer Notes

This document describes the files retained in the Jones automation exercise and how the TypeScript Playwright implementation is organized. Evaluators should start with [README.md](README.md); the original task is in [Jones_Automation_Exercise.md](Jones_Automation_Exercise.md).

## Root configuration

- `package.json` — scripts and development dependencies for Playwright, TypeScript and Allure.
- `pnpm-lock.yaml` — locked dependency versions; install with `pnpm install --frozen-lockfile`.
- `playwright.config.ts` — Chromium, line and Allure reporters, screenshots and compact WebM recording.
- `tsconfig.json` — TypeScript checks for the Playwright config and tests.
- `.gitignore` — excludes generated dependencies, screenshots, videos, test output and local Allure reports.
- `AGENTS.md` — repository guidance for future code changes.
- `Jones_Automation_Exercise.md` — original exercise requirements.
- `README.md` — evaluator quick start, requirement coverage and report access.

The automation targets `https://test.netlify.app/` directly; it does **not** require a local copy of the target website. An earlier standalone JavaScript prototype and copied website assets were removed in the cleanup PR to avoid two competing entry points.

## Test implementation

- `tests/ui/callback.spec.ts` — single end-to-end scenario with named `test.step` phases and fresh navigation in `beforeEach`.
- `tests/ui/models/CallbackPage.ts` and `ThankYouPage.ts` — Page Objects with locators, navigation and basic page actions; `tests/ui/models/index.ts` exports them.
- `tests/ui/keywords/callback.keywords.ts` — form readiness, filling and value assertions, employee selection and screenshot attachment.
- `tests/ui/keywords/thankYou.keywords.ts` — submission, navigation response HTTP 200, destination URL and confirmation heading checks; logs success only after verification.
- `tests/ui/fixtures/callbackData.ts` — synthetic input values and `51-500` employee selection.

The pre-submission screenshot uses `testInfo.outputPath(...)` and `testInfo.attach(...)`. Generated screenshots and videos belong in test output, not source control.

## Run and inspect locally

Requires Node.js 22 and pnpm 11.19.x. From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm run test:install-browsers
pnpm run typecheck
pnpm test
pnpm run report:generate
pnpm run report:open
```

`pnpm test` runs against the live site; it must fail rather than accept a broken thank-you page or an HTTP 404. A separate `pnpm run test:retention` checks the report-retention logic without opening Chromium. The generated `allure-results/`, `allure-report/` and Playwright outputs are ignored by Git.

## GitHub Actions, Allure and Pages

- `.github/workflows/allure-reports.yml` — checks and executes Playwright on pull requests; on `master` or a manual run selected on `master`, also generates, archives and deploys Allure to GitHub Pages.
- `scripts/retain-allure.mjs` — retains up to five complete reports under `runs/<GitHub Actions run ID>/` on the `allure-reports-store` branch; generates a simple root redirect to the most recent report.
- `tests/ci/retain-allure.test.mjs` — checks retention, reruns and invalid inputs.

After a successful deployment, the Actions run **Summary** contains a clickable link to that run's report. Pull-request runs verify the tests but do not deploy reports. A failed Playwright test still proceeds to reporting where possible and leaves CI failed. Report screenshots and videos may be publicly accessible via Pages: use synthetic input only and do not store credentials or confidential screenshots.

GitHub Pages must use **GitHub Actions** as its publishing source. The workflow uses the Actions-provided `GITHUB_TOKEN`; no personal access token is required.
