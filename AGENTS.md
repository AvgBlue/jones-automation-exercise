# AGENTS.md — Jones Automation Exercise

## Scope and sources of truth

This repository is a TypeScript Playwright submission for the Jones callback-form exercise. The user decides the scope, architecture and merge timing. Make narrow changes for the current request and preserve unrelated work.

Before changing code or project structure, read:
- `Jones_Automation_Exercise.md` for the original task and deliverables.
- `docs.md` for the current repository structure and commands.
- Relevant test, configuration and CI files for actual implementation details.

The target is the **live** `https://test.netlify.app/` website. There is no local website snapshot or standalone JavaScript implementation in the final project. Do not silently introduce a mock or accept a broken live destination as success.

## Exercise behavior to preserve

The callback scenario must:
1. Fill Name, Email, Phone, Company and Website with synthetic values.
2. Change Number of Employees to `51-500` (bonus).
3. Capture and attach a screenshot **before** clicking `Request a call back`.
4. Submit, verify successful navigation and a visible thank-you heading, and call `console.log` only after those checks succeed.

The implementation uses `tests/ui/callback.spec.ts`, Page Objects under `tests/ui/models/`, small scenario-specific functions under `tests/ui/keywords/`, and data under `tests/ui/fixtures/`. Prefer accessible labels or stable attributes, built-in Playwright waiting and precise assertions; avoid fixed sleeps and fragile positional selectors.

## Reporting and CI

`playwright.config.ts` enables Chromium, Allure reporting, screenshots and compact videos. GitHub Actions runs the tests on pull requests, while runs on `master` publish reports to GitHub Pages. The retention script preserves up to five reports and CI places the report URL directly in the run Summary when deployment succeeds. Tests must still fail the overall CI result when assertions fail, even if the report is published. Never include secrets, sensitive data or real personal information in publicly accessible reports.

Keep the README evaluator-oriented (how to run, what is tested, where to find results) and `docs.md` developer-oriented (structure and maintenance). Retain the original assignment for traceability.

## Collaboration and verification

- Use a feature branch and pull request targeting `master`; do not merge without the user's request.
- Keep dependencies and architectural changes proportional to the requested work.
- Do not delete documentation simply because it is not required at runtime; update stale information instead.
- Run the smallest relevant checks: `pnpm run typecheck`, `pnpm run test:retention`, `pnpm test`, and `pnpm run report:generate` as appropriate. CI is a valid verification source when local execution is unavailable.
- In the final response distinguish checks that passed, checks that failed and checks that were not run. Do not claim Pages deployment was verified by a pull-request smoke test.
