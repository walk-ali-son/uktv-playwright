// @ts-check

/**
 * Shared page-object base. Project pages extend this.
 */
export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Opens a path on BASE_URL, or a full URL.
   * @param {string} path
   */
  async goto(path = '/') {
    await this.page.goto(path);
  }
}
