import { expect, type Locator, type Page } from '@playwright/test';
import { HomePage } from './home-page.ts';

const profile = {
  firstName: 'Alex',
  lastName: 'Tester',
  day: '15',
  month: '3',
  year: '1990',
  gender: 'NotKnown',
  postcode: 'SW1A 1AA',
};

/**
 * U registration is three steps: account, profile, then marketing.
 * Skip & register leaves the marketing emails off.
 */
export class RegisterPage extends HomePage {
  readonly email: Locator;
  readonly password: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly day: Locator;
  readonly month: Locator;
  readonly year: Locator;
  readonly gender: Locator;
  readonly postcode: Locator;
  readonly skipAndRegister: Locator;

  constructor(page: Page) {
    super(page);
    this.email = page.locator('#email');
    this.password = page.locator('#password');
    this.firstName = page.locator('#firstname');
    this.lastName = page.locator('#lastname');
    this.day = page.locator('#day');
    this.month = page.locator('#month');
    this.year = page.locator('#year');
    this.gender = page.locator('#gender');
    this.postcode = page.locator('#postcode');
    this.skipAndRegister = page.getByRole('button', { name: 'Skip & register' });
  }

  async open(): Promise<void> {
    await this.goto('/account/register');
  }

  async register(email: string, password: string): Promise<void> {
    await this.open();
    await this.email.fill(email);
    await this.password.fill(password);
    await this.page.locator('#next-button-1').click();

    await this.firstName.fill(profile.firstName);
    await this.lastName.fill(profile.lastName);
    await this.day.fill(profile.day);
    await this.month.fill(profile.month);
    await this.year.fill(profile.year);
    await this.gender.selectOption(profile.gender);
    await this.postcode.fill(profile.postcode);
    await this.page.locator('#next-button-2').click();

    await this.skipAndRegister.click();
  }

  async expectRegistered(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/account\/register/);
    await expect(this.page.getByRole('heading', { name: /Step 1 of 3/ })).toBeHidden();
    await expect(this.page.getByRole('link', { name: 'Sign in', exact: true })).toBeHidden();
  }
}
