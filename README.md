# Jones Automation Exercise

A Playwright + TypeScript end-to-end test for the callback form at [test.netlify.app](https://test.netlify.app/). This repository is my submission for the [Jones automation exercise](Jones_Automation_Exercise.md).

## Run the exercise

**Prerequisites:** Node.js 22, pnpm 11.19.x, internet access, and a machine that can run Chromium. Run these commands from the repository root:

```bash
pnpm install --frozen-lockfile
pnpm run test:install-browsers
pnpm test
```

`pnpm test` runs the callback scenario in Chromium. On success, its console output includes:

```text
Successfully reached thank-you page after callback form submission
```

The test uses the **live website**, not a mocked or locally hosted copy. A network issue or a broken destination causes the test to fail rather than reporting a false positive.

## What is covered

| Exercise requirement | Implementation |
| --- | --- |
| Fill Name, Email, Phone, Company and Website | Fills the five fields with synthetic data and verifies their values. |
| Screenshot before clicking **Request a call back** | Saves a full-page screenshot before submission and attaches it to the test result as `callback-before-submit`. |
| Bonus: change Number of Employees from `1-10` to `51-500` | Selects `51-500` and verifies the selected value. |
| Submit the form and log arrival at the thank-you page | Clicks the button, checks that the navigation response is HTTP 200, verifies the destination URL and visible thank-you heading, then calls `console.log`. |

The scenario is in [`tests/ui/callback.spec.ts`](tests/ui/callback.spec.ts). Named `test.step` sections make each phase visible in the report. Page Objects provide locators and basic interactions; small keyword functions group actions and assertions. The input data is synthetic and separate from the test.

## Review the results

Each test records a compact WebM video and takes a pre-submission screenshot. To generate and open the local Allure report **after** running the test:

```bash
pnpm run report:generate
pnpm run report:open
```

The generated `allure-results/`, `allure-report/`, `test-results/`, and `artifacts/` directories are intentionally excluded from Git. The screenshot and recording are available as attachments in Allure; generated evidence is not committed to the repository.

### GitHub Actions

The [CI workflow](.github/workflows/allure-reports.yml) runs checks and the Playwright scenario on pull requests. On `master` (including manual workflow runs), it also generates and deploys Allure to GitHub Pages. Open a completed [GitHub Actions run](https://github.com/AvgBlue/jones-automation-exercise/actions/workflows/allure-reports.yml) and use **View this run’s Allure report** in the run's **Summary**—there is no need to inspect job logs. Deployment failures are reported in the summary instead of showing an unverified link.

The workflow keeps the **five most recently published complete reports**. A failing Playwright test still produces a report if publication succeeds, while the CI run ultimately remains failed. Older per-run URLs stop working when pruned. Published Pages reports, including screenshots and videos, may be publicly accessible; the test uses synthetic data and no credentials.

## Project map

| Path | Purpose |
| --- | --- |
| `tests/ui/callback.spec.ts` | End-to-end callback scenario and ordered test steps. |
| `tests/ui/models/` | `CallbackPage` and `ThankYouPage` Page Objects. |
| `tests/ui/keywords/` | Form actions, assertions, screenshot attachment and confirmation checks. |
| `tests/ui/fixtures/callbackData.ts` | Synthetic form values and employee-count selection. |
| `playwright.config.ts` | Chromium, Allure reporter, screenshots and video settings. |
| `scripts/retain-allure.mjs` | Keeps the five most recent published reports. |
| `tests/ci/retain-allure.test.mjs` | Tests the report-retention script. |

For a quick static check without opening the browser, run `pnpm run typecheck`. To test report retention separately, run `pnpm run test:retention`. The original exercise instructions remain in [`Jones_Automation_Exercise.md`](Jones_Automation_Exercise.md).
