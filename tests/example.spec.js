// @ts-check
import { test, expect } from '@playwright/test';

test('playwright can open a page', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
