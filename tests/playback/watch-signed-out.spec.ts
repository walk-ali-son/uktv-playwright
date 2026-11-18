import { test } from '@playwright/test';
import { PlayerPage } from '../../pages/player-page.ts';

test('a signed-out user has to sign in to watch', async ({ page }) => {
  const player = new PlayerPage(page);
  await player.openEpisode();
  await player.expectSignInRequired();
});
