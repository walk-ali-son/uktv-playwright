import type { Page } from '@playwright/test';
import { CookieBanner } from '../components/cookie-banner.ts';

/**
 * Home page. Login, register, and the player extend this so they share navigation and cookies.
 */
export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Opens a path on the site, then accepts cookies if the banner is showing.
   */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
    await new CookieBanner(this.page).accept();
  }
}
