# UKTV Playwright

Playwright tests for [U](https://u.co.uk). This folder is its own project: its own `package.json`, config, and `node_modules`.

It does not use the Playwright learning work in `~/playwright-project`, or the Playwright files in the home directory.

## Tests

| Test | File | Needs |
| --- | --- | --- |
| A new user can register | `tests/account/register.spec.ts` | `U_REGISTER_EMAIL` |
| An existing user can sign in | `tests/account/login.spec.ts` | `U_EMAIL` and `U_PASSWORD` |
| A signed-out user has to sign in to watch | `tests/playback/watch-signed-out.spec.ts` | nothing |
| A signed-in user can start watching | `tests/playback/watch-signed-in.spec.ts` | `U_EMAIL` and `U_PASSWORD` |

Cookies, registration, sign-in, and playback are shared steps. Tests do not call each other.

- The cookie banner is a component (`components/cookie-banner.ts`). The home page accepts it after opening a page.
- Register, login, and the player live in `pages/`.
- Email and password stay in `.env`. The episode path is on the player page. The registration name, date of birth, and postcode are on the register page.

The register test creates a real U account. Use an inbox you control. The date of birth sent by the test is 15 March 1990.

## Run tests

```bash
cp .env.example .env
npm test
```

Fill in `.env` before the register, login, and signed-in watch tests can run. The signed-out watch test runs without an account.

```bash
npm run test:headed
npm run test:ui
npm run report
```

Chromium is the browser these tests use. Run them from the UK. U can look different outside the UK, and GitHub-hosted runners are often outside the UK.

`.env` is not committed.

## CI

`.github/workflows/playwright.yml` runs the suite on pushes and pull requests to `main`. Add repository secrets named `U_EMAIL`, `U_PASSWORD`, and `U_REGISTER_EMAIL` when those tests should run in GitHub Actions. Without the secrets, those three tests skip and the signed-out watch test still runs.
