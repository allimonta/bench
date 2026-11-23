import { type Locator, type Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

// QACluster: generated from the login trace; adjust path and locators according to recon/traces.
export class LoginPage extends BasePage {
  protected readonly path = '/login';
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    super(page);
    this.email = page.getByLabel(/email|correo|usuario/i);
    this.password = page.getByLabel(/contraseña|password/i);
    this.submit = page.getByRole('button', { name: /ingresar|iniciar sesión|log ?in|sign ?in/i });
  }

  async login(user: string, pass: string): Promise<void> {
    await this.email.fill(user);
    await this.password.fill(pass);
    await this.submit.click();
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/login/);
  }
}
