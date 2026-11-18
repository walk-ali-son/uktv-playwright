import { test, expect } from '@playwright/test';
import { env } from '../../config/environments.ts';

test.describe('Task 1.4 - Sign-in redirect', () => {
  test('Sign in includes show information in the URL', async ({ page }) => {
    await page.goto(env.baseURL);
    await expect(page).toHaveURL(env.baseURL);

  //From a featured banner on the homepage, select the "Sign in to watch" link and verify that:
	//You are taken to the account page.
	//The information identifying the show you came from is preserved in the URL.

    await page.getByRole('link', { name: 'Sign in to watch The Red King' }).click();
    await expect(page.getByRole('link', { name: 'Sign in to watch' })).toBeVisible();
    await expect(page).toHaveURL(/slug=the-red-king/);
    //would want to improve this by collecting the show name from the banner and asserting it is in the title, as this will fail once the banner changes

  });
});
