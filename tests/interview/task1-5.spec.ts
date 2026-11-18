import { test, expect, devices } from '@playwright/test';
import { env } from '../../config/environments.ts';
import AxeBuilder from '@axe-core/playwright';

test.describe('Task 1.5 - Responsive and accessibility checks', () => {
  test('Accessability checks', async ({ page }) => {
    await page.goto(env.baseURL);
    await expect(page).toHaveURL(env.baseURL);

    // Verify that the "Skip to content" link works using the keyboard only.
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Run an automated accessibility scan (for example, axe) and be prepared to explain what it found and how you would handle the results.
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });
});

const { defaultBrowserType: _defaultBrowserType, ...iPhone17 } = devices['iPhone 17'];

test.describe('Homepage smoke test on mobile', () => {
  test.use(iPhone17);

  test('Homepage smoke test on mobile', async ({ page }) => {
    // Run your smoke test on both a desktop and a mobile viewport.
    // Tests run by default on desktop, so only adding mobile viewport here
    //This test fails, changes need to be made as desktop and mobile have different layouts and selectors, but this is how to run it

    await page.goto(env.baseURL);
    await expect(page).toHaveURL(env.baseURL);

    // The page title contains "Watch FREE On Demand".
    await expect(page).toHaveTitle(/Watch FREE On Demand/);

    // The cookie banner is handled without causing the test to fail if it does not appear.
    const accept = page.getByRole('button', { name: 'Accept' });
    if (await accept.isVisible()) {
      await accept.click();
    }

    // The main navigation shows Categories, Channels, A-Z and TV Guide.
    await expect(page.getByRole('button', { name: 'Categories' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Channels' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'A-Z' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'TV Guide' })).toBeVisible();

    // The "Top 10 This Week" section contains exactly 10 shows, each linking to a show page.
    await expect(page.getByRole('list', { name: 'Top 10 This Week' }).getByRole('link')).toHaveCount(10);
    await expect(page.getByRole('list', { name: 'Top 10 This Week' }).getByRole('link').first()).toHaveAttribute('href', /\/shows\//);
    await expect(page.getByRole('list', { name: 'Top 10 This Week' }).getByRole('link').last()).toHaveAttribute('href', /\/shows\//);
  });
});
