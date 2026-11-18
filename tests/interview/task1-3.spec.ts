import { test, expect } from '@playwright/test';
import { env } from '../../config/environments.ts';

test.describe('Task 1.3 - Search', () => {
  test('Search functionality', async ({ page }) => {
    await page.goto(env.baseURL);
    await expect(page).toHaveURL(env.baseURL);

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

    
  });
});
