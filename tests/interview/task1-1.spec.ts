import { test, expect } from '@playwright/test';
import { env } from '../../config/environments.ts';

test.describe('Task 1.1 - Homepage smoke test', () => {
  test('Assertions and actions on homepage', async ({ page }) => {
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
