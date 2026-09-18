# File Structure

This document describes the recommended file structure for the Jones Automation Exercise, inspired by the XM Cyber E2E project.

## Root Level

- `package.json` - Project configuration and scripts
- `tsconfig.json` - TypeScript compiler options
- `playwright.config.ts` - Playwright test runner configuration (future)
- `pnpm-lock.yaml` - Lock file for pnpm package manager
- `Jones_Automation_Exercise.md` - Assignment reference document
- `AGENTS.md` - Agent instructions for this project
- `docs.md` - This file, documenting the project structure

## test-site/

The target application files.

- `index.html` - Main form page
- `_app.css` - Stylesheet
- `jones-automation.js` - Existing automation script (can be converted to TypeScript)

## tests/ui/

Playwright UI tests organized by feature.

- `callback.spec.ts` - Callback-request scenario and its assertions

### tests/ui/models/

Page objects and reusable UI components.

- `CallbackPage.ts` - Callback form interactions and locators
- `ThankYouPage.ts` - Destination page locators and navigation
- `index.ts` - Page-object exports

### tests/ui/keywords/

Small, scenario-specific reusable verification operations called from tests; not a generic keyword execution engine.

- `callback.keywords.ts` - Form readiness and entered-value verification

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
