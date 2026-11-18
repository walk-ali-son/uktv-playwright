import { expect, type Locator, type Page } from '@playwright/test';
import { HomePage } from './home-page.ts';

const episodePath = '/shows/ghosts/series-2/episode-4/6373419978112';

/**
 * Episode player. Signed-out viewers get "Sign in to watch".
 * Some titles also show a parental-control prompt before play.
 */
export class PlayerPage extends HomePage {
  readonly episodePath: string;
  readonly signInToWatch: Locator;
  readonly playWithoutPin: Locator;
  readonly video: Locator;

  constructor(page: Page) {
    super(page);
    this.episodePath = episodePath;
    this.signInToWatch = page.getByRole('link', { name: 'Sign in to watch' });
    this.playWithoutPin = page.getByRole('button', { name: 'Play without PIN' });
    this.video = page.locator('video').first();
  }

  async openEpisode(): Promise<void> {
    await this.goto(this.episodePath);
  }

  /**
   * Chooses Play without PIN when the guidance prompt is on screen.
   * Leaves a PIN unset so later tests are not blocked by it.
   */
  async dismissParentalPrompt(): Promise<void> {
    const showing = await this.playWithoutPin.isVisible().catch(() => false);
    if (showing) {
      await this.playWithoutPin.click();
    }
  }

  async expectSignInRequired(): Promise<void> {
    await this.dismissParentalPrompt();
    await expect(this.signInToWatch.first()).toBeVisible();
    await this.signInToWatch.first().click();
    await expect(this.page).toHaveURL(/\/account\/login/);
  }

  /**
   * Confirms the player has started. An advert may play before the episode.
   */
  async expectPlaybackStarted(): Promise<void> {
    await this.dismissParentalPrompt();
    await expect(this.signInToWatch).toHaveCount(0);

    const play = this.page.getByRole('button', { name: 'Play', exact: true });
    if (await play.isVisible().catch(() => false)) {
      await play.click();
    }

    await expect.poll(async () => {
      return this.video.evaluate((element) => {
        const video = element as HTMLVideoElement;
        return video.currentTime > 0 && !video.paused && video.readyState >= 2;
      });
    }, {
      timeout: 45000,
      message: 'Playback did not start',
    }).toBe(true);
  }
}
