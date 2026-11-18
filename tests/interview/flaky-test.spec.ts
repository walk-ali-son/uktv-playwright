import { test, expect } from '@playwright/test';

//test('top 10 shows', async ({ page }) => {
  //await page.goto('https://u.co.uk');
  //await page.waitForTimeout(5000);
  //await page.click('div:nth-child(7) > div > a');
  //expect(await page.title()).toBe('The Chelsea Detective');
  //const items = await page.$$('.carousel-item');
  //expect(items.length).toBe(10);
//});

test('top 10 shows', async ({ page }) => {
  await page.goto('https://u.co.uk');
  await expect(page).toHaveURL('https://u.co.uk');

  // The cookie banner is handled without causing the test to fail if it does not appear.
  const accept = page.getByRole('button', { name: 'Accept' });
  if (await accept.isVisible()) {
    await accept.click();
  }

  await page.getByRole('list', { name: 'Top 10 This Week' }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('list', { name: 'Top 10 This Week' }).getByRole('link')).toHaveCount(10);

  await page.getByRole('list', { name: 'Top 10 This Week' }).getByRole('link').nth(7).click();
  await expect(page).toHaveURL(/\/shows\/[^/]+\/watch-online/);

});