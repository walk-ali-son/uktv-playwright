# UKTV Playwright

Playwright framework for the UKTV project. This folder is its own project: its own `package.json`, config, and `node_modules`.

It does not use the Playwright learning work in `~/playwright-project`, or the Playwright files in the home directory. Running tests here does not change those.

## Run tests

```bash
npm test
```

Other commands:

```bash
npm run test:headed
npm run test:ui
npm run report
```

Chromium is installed for local runs. Firefox and WebKit are listed as comments in `playwright.config.js`. Uncomment a project, then run `npx playwright install firefox` or `npx playwright install webkit`.

## Point tests at the app

1. Copy `.env.example` to `.env`.
2. Set `BASE_URL` to the site under test, for example `https://example.com`.
3. Add specs under `tests/`. Page objects go in `src/pages` and can extend `BasePage`.

`tests/smoke/home.spec.js` stays skipped until `BASE_URL` is set. `tests/example.spec.js` opens the Playwright docs site so you can check the runner before the app URL is ready. Delete that example when you no longer need it.

`.env` is not committed.

## CI

`.github/workflows/playwright.yml` runs the suite on pushes and pull requests to `main`. Set a repository variable named `BASE_URL` when the smoke test should run in GitHub Actions.
