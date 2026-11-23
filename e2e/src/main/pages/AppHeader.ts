import { type Locator, type Page, expect } from '@playwright/test';

// The site header: on every screen, declared once, here (root: the <header> block).
export class AppHeader {
  readonly logoLink: Locator;
  readonly shopPartsLink: Locator;
  readonly sensorsLink: Locator;
  readonly limbsLink: Locator;
  readonly powerLink: Locator;
  readonly supportLink: Locator;
  readonly reserveButton: Locator;
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
    this.reserveButton = this.root.locator("//*[@id='reserveBtn']");
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

  /**
   * A button of the header, by the label it shows ("Reserve", "Cart"): their accessible names are longer
   * ("Reserve parts in bulk"), the visible label is what the user reads.
   */
  button(label: string): Locator {
    return this.root.locator(`//button[.//*[contains(@class,'btn-label')][normalize-space()='${label}']]`);
  }

  async clickButton(label: string): Promise<void> {
    await this.button(label).click();
  }

  /** The header is on screen (synchronization: the user looks at it). */
  async expectLoaded(): Promise<void> {
    await expect(this.root).toBeVisible();
  }

  /** Opens the "Reserve parts" panel. */
  async openReserve(): Promise<void> {
    await this.reserveButton.click();
  }

  /** The icon of a header button, by the label the button shows. */
  buttonIcon(label: string): Locator {
    return this.button(label).locator("//*[local-name()='svg']");
  }

  /** The text label of a header button ("Reserve"), visible or not. */
  buttonLabel(label: string): Locator {
    return this.root.locator(`//button//*[contains(@class,'btn-label')][normalize-space()='${label}']`);
  }

  /** Width and height the label of a header button takes on screen (a visually hidden label is clipped to 1x1). */
  async buttonLabelSize(label: string): Promise<{ width: number; height: number }> {
    const box = await this.buttonLabel(label).boundingBox();
    if (!box) throw new Error(`the header has no "${label}" button label`);
    return { width: box.width, height: box.height };
  }

  /** How many pixels the header's content overflows its width (0 or less: no horizontal scroll). */
  async horizontalOverflow(): Promise<number> {
    return this.root.evaluate((el) => el.scrollWidth - el.clientWidth);
  }

  /**
   * Whether the second button sits right after the first one on the same row of the header (gap of at most 24 px, as
   * the header's actions are laid out).
   */
  async buttonsSideBySide(first: string, second: string): Promise<boolean> {
    const a = await this.button(first).boundingBox();
    const b = await this.button(second).boundingBox();
    if (!a || !b) return false;
    const gap = b.x - (a.x + a.width);
    return Math.abs(a.y - b.y) < 4 && gap >= 0 && gap <= 24;
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
