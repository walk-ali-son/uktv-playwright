import { test, expect } from '@playwright/test';
import { uniqueRegisterEmail } from '../../fixtures/accounts.ts';
import { RegisterPage } from '../../pages/register-page.ts';

test('a new user can register', async ({ page }) => {
  const email = uniqueRegisterEmail();
  test.skip(!email, 'Set U_REGISTER_EMAIL in .env to an inbox you control');
  if (!email) {
    return;
  }

  const register = new RegisterPage(page);
  await register.register(email, `Uktv${Date.now()}a!`);
  await register.expectRegistered();
  await expect(page).toHaveTitle(/U/);
});
