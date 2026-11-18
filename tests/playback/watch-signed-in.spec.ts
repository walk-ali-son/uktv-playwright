import { test } from '@playwright/test';
import { loginAccount } from '../../fixtures/accounts.ts';
import { LoginPage } from '../../pages/login-page.ts';
import { PlayerPage } from '../../pages/player-page.ts';

test('a signed-in user can start watching', async ({ page }) => {
  const account = loginAccount();
  test.skip(!account, 'Set U_EMAIL and U_PASSWORD in .env');
  if (!account) {
    return;
  }

  test.setTimeout(60_000);

  const login = new LoginPage(page);
  await login.signIn(account.email, account.password);
  await login.expectSignedIn();

  const player = new PlayerPage(page);
  await player.openEpisode();
  await player.expectPlaybackStarted();
});
