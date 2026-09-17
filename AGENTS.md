# AGENTS.md - Jones Automation Exercise

## Role

Assist the user on the Jones Playwright automation exercise. The user leads architecture, scope, and implementation choices.

Work on the specific request in the current turn, keep changes small, and stop after reporting what changed and what was verified.

## Sources Of Truth

- `Jones_Automation_Exercise.md` is the assignment reference. Read it when the task concerns requirements, deliverables, or expected automation behavior.
- The repository state is the implementation reference. Inspect relevant files before changing them.
- The live application at `https://test.netlify.app/` is the behavior reference. Use the local `test-site/index.html` snapshot for quick locator context, but verify against the live site when behavior matters.

Current repository facts:

- Existing files include the assignment, `test-site/index.html`, `test-site/jones-automation.js`, and `test-site/_app.css`.
- `test-site/jones-automation.js` is a JavaScript Playwright script.
- There is currently no `package.json`, TypeScript config, Playwright test-runner config, or Page Object structure in this checkout.

User decisions:

- New automation work should use Playwright with TypeScript.
- Ask before converting the existing JavaScript script or adding TypeScript project setup files.

## Assignment Requirements

The automation flow must:

1. Fill Name, Email, Phone, Company, and Website.
2. Capture a screenshot before clicking the submit button.
3. Click `Request a call back`.
4. Log to `console.log` when the thank-you page is reached.

Bonus: change Number of Employees from `1-10` to `51-500`.

The requested deliverable is the automation files created. Treat additional infrastructure, tests, reporting, CI, or framework changes as out of scope unless the user asks for them.

## Structure Rules

Always read `docs.md` before adding or modifying files in this repository. It defines the approved file structure and conventions. If a proposed change conflicts with `docs.md`, call it out and ask how to proceed.

## Collaboration Rules

- Keep scope narrow: implement only the task the user asked for.
- Ask before introducing dependencies, new frameworks, Page Objects, converting existing JavaScript, test-runner setup, or broad restructuring.
- Preserve existing work. If unrelated files or changes are present, leave them alone.
- When the assignment, repository, and user request differ, follow the user request and call out the relevant difference.
- Separate confirmed facts from assumptions in the final response.

## Automation Guidance

Prefer Playwright locators that match the page structure:

- Use labels or stable attributes such as `id` and `name` for form fields.
- Avoid fragile positional selectors when a meaningful locator exists.
- Use Playwright's built-in waiting behavior instead of fixed sleeps.
- Make the thank-you-page log happen only after navigation or another confirmed success signal.

Known locator context from `test-site/index.html`:

- `#name`, `#email`, `#phone`, `#company`, `#website`
- `#employees` with option `51-500`
- submit button text `Request a call back`
- form action `thank-you.html`

## Verification

After a code change, run the smallest relevant check that the repo supports. If no package scripts or dependencies exist, say that clearly instead of claiming verification.

Report:

- files changed
- checks run
- any check failures or environment limits

## Pull Request Workflow

All changes should be made via pull requests:
- Create a new branch for your work
- Push the branch and open a PR targeting `master`
- The PR will be reviewed and merged by the user
- Track `docs.md` and `tests/` directory changes in PRs
- `artifacts/` is excluded from version control via `.gitignore`
