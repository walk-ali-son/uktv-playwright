import { test, expect } from '@playwright/test';
import { env } from '../../config/environments.ts';

test.describe('Task 1.2 - Data-driven navigation', () => {
  test('Assertions and actions on Top 10 This Week', async ({ page }) => {
    await page.goto(env.baseURL);
    await expect(page).toHaveURL(env.baseURL);

    // The cookie banner is handled without causing the test to fail if it does not appear.
    const accept = page.getByRole('button', { name: 'Accept' });
    if (await accept.isVisible()) {
      await accept.click();
    }

    // "Top 10 This Week" section, open at least three different shows. For each one, verify that:
    // The URL matches the pattern /shows/<slug>/watch-online.
    // The page displays a main heading.

    // before parametizing the test
    // await page.getByRole('list', { name: 'Top 10 This Week' }).getByRole('link').first().click();
    // await expect(page).toHaveURL(/\/shows\/[^/]+\/watch-online/);
    // await expect(page.getByRole('heading').first()).toBeVisible();
    // await page.getByRole('link', { name: 'U homepage' }).click();

    // await page.getByRole('list', { name: 'Top 10 This Week' }).getByRole('link').nth(2).click();
    // await expect(page).toHaveURL(/\/shows\/[^/]+\/watch-online/);
    // await expect(page.getByRole('heading').first()).toBeVisible();
    // await page.goBack();

    // await page.getByRole('list', { name: 'Top 10 This Week' }).getByRole('link').last().click();
    // await expect(page).toHaveURL(/\/shows\/[^/]+\/watch-online/);
    // await expect(page.getByRole('heading').first()).toBeVisible();

    //parametized
    const showLinks = page.getByRole('list', { name: 'Top 10 This Week' }).getByRole('link');
    const positions = [0, 1, 2];

    for (const [index, position] of positions.entries()) {
      await showLinks.nth(position).click();
      await expect(page).toHaveURL(/\/shows\/[^/]+\/watch-online/);
      await expect(page.getByRole('heading').first()).toBeVisible();

      if (index < positions.length - 1) {
        await page.goBack();
      }
    }
  });
});

