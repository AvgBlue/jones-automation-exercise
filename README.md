# Jones Automation Exercise

A Playwright + TypeScript end-to-end test for the callback form at [test.netlify.app](https://test.netlify.app/). This is my submission for the [Jones automation exercise](Jones_Automation_Exercise.md).

The scenario covers five form fields, the bonus employee-count change to `51-500`, a screenshot before submission, and a verified thank-you page followed by a console message. The implementation is in [`tests/ui/callback.spec.ts`](tests/ui/callback.spec.ts).

## Run locally

**Prerequisites:** Node.js 22, pnpm 11.19.x, internet access, and a machine that can run Chromium. From the repository root:

```bash
pnpm install --frozen-lockfile
pnpm run test:install-browsers
pnpm test
```

The test runs in Chromium against the **live website**, not a mock or local copy. On success, the console prints:

```text
Successfully reached thank-you page after callback form submission
```

A network problem or a broken thank-you destination fails the test rather than producing a false positive.

### View the local Allure report

Each run records a WebM video and attaches the pre-submission screenshot. After `pnpm test`, generate and open the report:

```bash
pnpm run report:generate
pnpm run report:open
```

Optional standalone checks:

```bash
pnpm run typecheck
pnpm run test:retention
```

Generated `allure-results/`, `allure-report/`, `test-results/`, and `artifacts/` directories are ignored by Git. Screenshots and videos are generated at runtime, not committed.

## Run in CI

The project uses a single [GitHub Actions workflow](.github/workflows/allure-reports.yml). To run it manually, open [Playwright tests and Allure reports](https://github.com/AvgBlue/jones-automation-exercise/actions/workflows/allure-reports.yml), click **Run workflow**, select the `master` branch, then start the run. Pushing to `master` also starts a publishing run automatically.

The `master` workflow installs locked dependencies and Chromium, runs TypeScript and report-retention checks, runs the Playwright scenario, generates the Allure report, and deploys it to GitHub Pages. It retains the **five most recently published complete reports**.

### View the CI report

Open the completed publishing run and select its **Summary**. Click **View this run’s Allure report** to open the published report directly—there is no need to inspect individual steps or logs. The report includes screenshots and video. If deployment fails, the Summary says that no live link is available.

Pull requests targeting `master` run verification and generate an Allure report in CI, **but do not deploy to Pages or display a live report URL**. If the Playwright test fails on `master`, publication is still attempted and the overall CI result remains failed. Pages keeps only five published reports, so old run-specific links expire after they are pruned.

**Privacy:** GitHub Pages reports, including screenshot and video attachments, may be publicly accessible even when the repository is private. Only synthetic test data is used; do not add credentials or sensitive data.

## Exercise coverage

| Requirement | Implementation |
| --- | --- |
| Fill Name, Email, Phone, Company and Website | Fill all five fields with synthetic data and verify their values. |
| Screenshot before clicking **Request a call back** | Capture a full-page screenshot before submission and attach it as `callback-before-submit`. |
| Bonus: change Number of Employees from `1-10` to `51-500` | Select `51-500` and verify the selected value. |
| Submit and log arrival at the thank-you page | Click the button, verify HTTP 200, the destination URL and visible heading, then call `console.log`. |

Named `test.step` phases make the flow readable. Page Objects provide locators and basic interactions, keywords group actions and assertions, and a fixture holds synthetic test data.

## Project map

| Path | Purpose |
| --- | --- |
| `tests/ui/callback.spec.ts` | End-to-end callback scenario and named steps. |
| `tests/ui/models/` | `CallbackPage` and `ThankYouPage` Page Objects. |
| `tests/ui/keywords/` | Form actions, assertions, screenshot attachment and confirmation checks. |
| `tests/ui/fixtures/callbackData.ts` | Synthetic form values and employee-count selection. |
| `playwright.config.ts` | Chromium, reporters, screenshots and video recording. |
| `scripts/retain-allure.mjs` | Maintains the five-report archive for GitHub Pages. |
| `tests/ci/retain-allure.test.mjs` | Tests the report-retention script. |

The original requirements are preserved in [`Jones_Automation_Exercise.md`](Jones_Automation_Exercise.md). For implementation details, see [`docs.md`](docs.md).
