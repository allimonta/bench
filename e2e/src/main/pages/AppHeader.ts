import { type Locator, type Page, expect } from '@playwright/test';

// The site header: on every screen, declared once, here (root: the <header> block).
export class AppHeader {
  readonly logoLink: Locator;
  readonly shopPartsLink: Locator;
  readonly sensorsLink: Locator;
  readonly limbsLink: Locator;
  readonly powerLink: Locator;
  readonly supportLink: Locator;
  readonly cartButton: Locator;
  readonly cartCount: Locator;
  private readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator('//header');
    this.logoLink = this.root.locator("//a[contains(@class,'logo')]");
    this.shopPartsLink = this.root.getByRole('link', { name: 'Shop parts', exact: true });
    this.sensorsLink = this.root.getByRole('link', { name: 'Sensors', exact: true });
    this.limbsLink = this.root.getByRole('link', { name: 'Limbs', exact: true });
    this.powerLink = this.root.getByRole('link', { name: 'Power', exact: true });
    this.supportLink = this.root.locator("//a[@href='#support']");
    this.cartButton = this.root.locator("//*[@id='cartBtn']");
    this.cartCount = this.root.locator("//*[@id='badge']");
  }

  /** A link of the navigation menu, by the words of its name ("Shop" finds "Shop parts"). */
  navLink(name: string): Locator {
    return this.root.getByRole('link', { name });
  }

  async clickNavLink(name: string): Promise<void> {
    await this.navLink(name).click();
  }

  async openCart(): Promise<void> {
    await this.cartButton.click();
  }

  /** The number the cart counter shows. */
  async cartCountValue(): Promise<number> {
    await expect(this.cartCount).toHaveText(/^\d+$/);
    return Number(await this.cartCount.textContent());
  }
}
