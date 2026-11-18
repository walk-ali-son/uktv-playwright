import type { Page } from '@playwright/test';

const handled = new WeakSet<Page>();

/**
 * U cookie banner. Accept is safe to call more than once on the same page.
 */
export class CookieBanner {
  constructor(private readonly page: Page) {}

  async accept(): Promise<void> {
    if (handled.has(this.page)) {
      return;
    }

    const accept = this.page.getByRole('button', { name: 'Accept', exact: true });
    const shown = await accept
      .waitFor({ state: 'visible', timeout: 5000 })
      .then(() => true)
      .catch(() => false);

    if (shown) {
      await accept.click();
    }

    handled.add(this.page);
  }
}
