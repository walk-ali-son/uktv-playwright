// @ts-check
import { test, expect } from '@playwright/test';

test.describe('project smoke', () => {
  test.skip(!process.env.BASE_URL, 'Set BASE_URL in .env to the site under test');

  test('home page responds', async ({ page }) => {
    const response = await page.goto('/');
    expect(response, 'home page did not return a response').toBeTruthy();
    expect(response.ok(), `home page returned ${response.status()}`).toBeTruthy();
  });
});
