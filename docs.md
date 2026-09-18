# File Structure

This document describes the recommended file structure for the Jones Automation Exercise, inspired by the XM Cyber E2E project.

## Root Level

- `package.json` - Project configuration and scripts for the legacy automation, Playwright tests, browser installation, and TypeScript checking
- `tsconfig.json` - TypeScript type-check configuration for `tests/**/*.ts` using bundler-compatible ESM resolution
- `playwright.config.ts` - Playwright test runner configuration (future, if required)
- `pnpm-lock.yaml` - Lock file for pnpm package manager
- `Jones_Automation_Exercise.md` - Assignment reference document
- `AGENTS.md` - Agent instructions for this project
- `docs.md` - This file, documenting the project structure

## Running the Tests

Install Node.js 20 or later and a compatible pnpm 11 version, then run:

```sh
pnpm install --frozen-lockfile
pnpm run test:install-browsers
pnpm run typecheck
pnpm test
```

`pnpm test` runs the Playwright test runner, while `pnpm run automation` retains the original JavaScript automation. Browser installation is a separate explicit step. The callback test requires the live destination to return HTTP 200 and display the expected thank-you heading; if the live site is broken, the E2E test must fail rather than accepting a 404.

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

## artifacts/

Playwright-generated test artifacts.

- `.gitkeep` - Placeholder for traces, videos, and reports

## XM Cyber Inspiration

The structure draws from XM Cyber's `tests/ui/` organization:

- `tests/ui/tests/` → This project's `tests/ui/` directly
- `tests/ui/models/` → Reusable page objects and UI components
- `tests/ui/fixtures/` → Test data and fixtures
- `artifacts/` → Generated test outputs

This structure keeps tests organized while avoiding unnecessary complexity from the larger XM Cyber setup (automation-infra, CI tools, Allure reporting, etc.).
