import { test, expect } from '@playwright/test';
import { env } from '../../config/environments.ts';

test.describe('All tasks as one complete test on desktop', () => {
  test('u.co.uk website primary actions as a logged out user', async ({ page }) => {
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

    // Top 3 links in the "Top 10 This Week" section open
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

    //Search for a known show and verify it appears in the results.
    await page.getByRole('link', { name: 'Search', exact: true }).click();
    await page.getByRole('combobox', { name: 'Search' }).click();
    await page.getByRole('combobox', { name: 'Search' }).fill('the Bill');
    await page.getByRole('combobox', { name: 'Search' }).press('Enter');

    await expect(page.getByRole('list').filter({ hasText: /The Bill/ })).toBeVisible();

    //Search for a string that cannot match anything and verify the site behaves sensibly.
    await page.getByRole('link', { name: 'Search', exact: true }).click();
    await page.getByRole('combobox', { name: 'Search' }).click();
    await page.getByRole('combobox', { name: 'Search' }).fill('hello world');
    await page.getByRole('combobox', { name: 'Search' }).press('Enter');

    await expect(page.getByText('No search results for “hello world”')).toBeVisible();

    //Try at least two unusual inputs (for example, special characters or a very long string) and verify the page does not break.
    await page.getByRole('link', { name: 'Search', exact: true }).click();
    await page.getByRole('combobox', { name: 'Search' }).click();
    await page.getByRole('combobox', { name: 'Search' }).fill('!@£$%^&*()_+');
    await page.getByRole('combobox', { name: 'Search' }).press('Enter');

    await expect(page.locator('div').filter({ hasText: /Search Results/ }).first()).toBeVisible();

    await page.getByRole('link', { name: 'Search', exact: true }).click();
    await page.getByRole('combobox', { name: 'Search' }).click();
    await page.getByRole('combobox', { name: 'Search' }).fill('aaaaaaaaaaaaabbbbbbbbbbbccccccccccddddddddddddeeeeeeeeeeeefffffffffgggggggghhhhhhhhhaaaaaaaaaaaaabbbbbbbbbbbccccccccccddddddddddddeeeeeeeeeeeefffffffffgggggggghhhhhhhhh');
    await page.getByRole('combobox', { name: 'Search' }).press('Enter');

    await expect(page.getByText(/No search results for/)).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /we can't seem to find that/ }).first()).toBeVisible();

    //return to homepage 
    await page.getByRole('link', { name: 'U homepage' }).click();

    // Feature banner opens the sign in page for the relevant show
    await page.getByRole('link', { name: 'Sign in to watch The Red King' }).click();
    await expect(page).toHaveURL(/slug=the-red-king/);

  });
});
