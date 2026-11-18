import { test } from '@playwright/test';
import { loginAccount } from '../../fixtures/accounts.ts';
import { LoginPage } from '../../pages/login-page.ts';

test('an existing user can sign in', async ({ page }) => {
  const account = loginAccount();
  test.skip(!account, 'Set U_EMAIL and U_PASSWORD in .env');
  if (!account) {
    return;
  }

  const login = new LoginPage(page);
  await login.signIn(account.email, account.password);
  await login.expectSignedIn();
});
