# UKTV Playwright

Playwright tests for [U](https://u.co.uk). Tests run in Chromium. They use the desktop viewport, except the second test in `task1-5.spec.ts`, which uses an iPhone 17 viewport.

The base URL is set in `config/environments.ts`. 

Playwright Codegen was used to help find selectors.

Each task started in its own file so failures were quicker and easier to find. They are also combined in `complete-test-desktop.spec.ts` as one desktop e2e test.

AI was used to push the code to Git and in the initial framework set up (although I gave a lot of instructions and made changes for best practices in this, although not all of them were used for this due to time, such as POM files were not set up).

## Run tests

Clone this repository, then run these commands from the project folder:

```bash
npm install
npm run install:browsers
npm test
```

`npm run test:headed` opens the browser while the tests run.

Two tests in `task1-5.spec.ts` fail on a normal run:

- The accessibility check fails because axe finds issues on the homepage. The findings are listed below.
- The iPhone 17 smoke test fails because the mobile layout does not use the same navigation controls as desktop.

## Test files

### task1-1.spec.ts - Homepage smoke test

Accepts the cookie banner only when it is showing. Checks that the Top 10 list has 10 links, and that the first and last link to a show page.

### task1-2.spec.ts - Data-driven navigation

The three show flows were written separately, then merged into one loop that opens the first three shows and then stops. `showLinks` and `positions` name the list and which items to open. The cookie banner is accepted here because it covers the third item and the click never finishes. `page.goBack()` returns to the list between shows.

### task1-3.spec.ts - Search

Searches for a known show, a string that matches nothing, and two unusual inputs.

### task1-4.spec.ts - Sign-in redirect

Checks the current featured banner, "Sign in to watch The Red King". To keep this working when the banner changes, the test would need to read the show name from the link and match that slug in the URL.

### task1-5.spec.ts - Responsive and accessibility checks

The first test presses Tab and Enter, then runs axe. It does not yet check that the Skip to content link moved focus to the main content.

The second test runs the homepage smoke test at an iPhone 17 viewport. It fails because the mobile layout uses different controls. It shows that the test can run on a mobile device.

### complete-test-desktop.spec.ts

All of the desktop tasks in one end-to-end test.

## Axe findings on the homepage

These are all in the featured carousel:

- **Critical.** The pagination is marked as a tablist, but its children are `li` elements. A tablist must contain tabs.
- **Critical.** The dot buttons have `role="tab"`, but they sit inside those `li` elements rather than directly in the tablist.
- **Serious.** Those same `li` elements are no longer valid list items, because their parent is a tablist instead of a list.
- **Minor.** One carousel slide is an `li` given `role="tabpanel"`, which is not an allowed role for a list item.

## Debugging flaky-test.spec.ts

The commented test at the top of the file has these problems:

1. Lines 8 and 9 count `.carousel-item` after the click, so the count runs on the show page instead of the homepage. It should run before the click.
2. The Top 10 order changes. The test hardcodes which item to click and which show title to expect, so it fails when that show is no longer in that position.
3. Replace `waitForTimeout` with an assertion that the Top 10 list is visible.
4. Accept the cookie banner so it does not cover the page.
5. Scrolling the Top 10 list into view makes debugging easier.

### Investigating intermittent CI failures

1. Check the error, screenshots, video, and trace for the failing test.
2. Compare it with other failures. Is it always the same step? Run it again and see if it still fails about one time in five.
3. Compare the browser and speed. CI runs headless Chromium. A headed run on this machine can be slower, so a race can pass locally and fail in the pipeline.
4. Check region before time zone. GitHub-hosted runners are often outside the UK, and U can look different from abroad.
