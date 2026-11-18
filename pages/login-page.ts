import { expect, type Locator, type Page } from '@playwright/test';
import { HomePage } from './home-page.ts';

export class LoginPage extends HomePage {
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    super(page);
    this.email = page.getByRole('textbox', { name: 'Email address' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.submit = page.getByRole('button', { name: 'Sign in to U' });
  }

  async open(): Promise<void> {
    await this.goto('/account/login');
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.open();
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }

  async expectSignedIn(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/account\/login/);
    await expect(this.page.getByRole('heading', { name: 'Sign in to Stream on U' })).toBeHidden();
    await expect(this.page.getByRole('link', { name: 'Sign in', exact: true })).toBeHidden();
  }
}
