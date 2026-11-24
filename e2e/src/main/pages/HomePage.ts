import { type Locator, type Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import type { ShopProduct } from '@data/products';
import { parseUsd } from '@utils/money';

// The one-page shop (root: <main id="top">): the banner and the Shop section with its filters and product grid.
export class HomePage extends BasePage {
  protected readonly path = '/';
  readonly heroHeading: Locator;
  readonly shopPartsCta: Locator;
  readonly catalogHeading: Locator;
  readonly shopSection: Locator;
  readonly filters: Locator;
  readonly filterButtons: Locator;
  readonly allFilter: Locator;
  readonly sensorsFilter: Locator;
  readonly limbsFilter: Locator;
  readonly powerFilter: Locator;
  readonly processingFilter: Locator;
  readonly grid: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly productImages: Locator;
  readonly productPrices: Locator;
  // TODO(testability): the shop has no sort control yet (TC-VOLUME1-010): suggest an id for it when it is built.
  readonly sortSelect: Locator;
  // TODO(testability): the shop has no search field yet (TC-VOLUME1-012/013): suggest an id for it when it is built.
  readonly searchBox: Locator;
  private readonly root: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.locator("//*[@id='top']");
    this.heroHeading = this.root.getByRole('heading', { name: 'Build your android, one part at a time.', exact: true });
    this.shopPartsCta = this.root.locator("//a[contains(@class,'cta')]");
    this.catalogHeading = this.root.getByRole('heading', { name: 'Parts catalog', exact: true });
    this.shopSection = this.root.locator("//*[@id='shop']");
    this.filters = this.root.locator("//*[@id='filters']");
    this.filterButtons = this.root.locator("//button[contains(@class,'filter')]");
    this.allFilter = this.root.getByRole('button', { name: 'All', exact: true });
    this.sensorsFilter = this.root.getByRole('button', { name: 'Sensors', exact: true });
    this.limbsFilter = this.root.getByRole('button', { name: 'Limbs', exact: true });
    this.powerFilter = this.root.getByRole('button', { name: 'Power', exact: true });
    this.processingFilter = this.root.getByRole('button', { name: 'Processing', exact: true });
    this.grid = this.root.locator("//*[@id='grid']");
    this.productCards = this.root.locator("//article[contains(@class,'card')]");
    this.productNames = this.productCards.getByTestId('product-name');
    this.productImages = this.root.locator("//div[contains(@class,'card-art')]");
    this.productPrices = this.root.getByTestId('product-price');
    this.sortSelect = this.root.getByRole('combobox', { name: 'Sort' });
    this.searchBox = this.root.getByRole('searchbox', { name: 'Search' });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.catalogHeading).toBeVisible();
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  /** Opens the shop straight at its Shop section. */
  async openShopSection(): Promise<void> {
    await this.page.goto(`${this.path}#shop`);
    await expect(this.shopSection).toBeInViewport();
  }

  /** Opens the shop on a viewport of the given width (812 px high, a phone's, as the explorer measured it). */
  async openOnViewport(width: number): Promise<void> {
    await this.page.setViewportSize({ width, height: 812 });
    await this.goto();
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.expectLoaded();
  }

  productCard(id: string): Locator {
    return this.root.locator(`//article[contains(@class,'card')][@data-product-id='${id}']`);
  }

  /** The "Add to cart" button of a product, by its own attribute: its label turns to "Added" for a moment after a click. */
  addToCartButton(id: string): Locator {
    return this.root.locator(`//button[@data-add='${id}']`);
  }

  /** A button of a product's card, by its visible name. */
  productButton(id: string, name: string): Locator {
    return this.productCard(id).getByRole('button', { name, exact: true });
  }

  /** Name, price and description of a product, as its card shows them. */
  async productInfo(id: string): Promise<ShopProduct> {
    const card = this.productCard(id);
    await expect(card, `the shop does not list the product "${id}"`).toBeVisible();
    return {
      id,
      name: ((await card.getByTestId('product-name').textContent()) ?? '').trim(),
      price: parseUsd((await card.getByTestId('product-price').textContent()) ?? ''),
      description: ((await card.locator("//*[contains(@class,'card-body')]/p").textContent()) ?? '').trim(),
    };
  }

  async addToCart(id: string): Promise<void> {
    await this.addToCartButton(id).click();
  }

  /** A product's card, by the name it shows. */
  productCardNamed(name: string): Locator {
    return this.root.locator(`//article[contains(@class,'card')][.//*[@data-testid='product-name'][normalize-space()='${name}']]`);
  }

  /** Adds a part to the cart by the name its card shows (the "Add to cart" button, by its own attribute). */
  async addToCartByName(name: string): Promise<void> {
    await this.productCardNamed(name).locator('//button[@data-add]').click();
  }

  async clickProductButton(id: string, name: string): Promise<void> {
    await this.productButton(id, name).click();
  }

  async openProductDetails(id: string): Promise<void> {
    await this.productCard(id).getByTestId('product-name').click();
  }

  filterButton(category: string): Locator {
    return this.filters.getByRole('button', { name: category, exact: true });
  }

  async filterByCategory(category: string): Promise<void> {
    await this.filterButton(category).click();
    await expect(this.filterButton(category)).toHaveAttribute('aria-pressed', 'true');
  }

  /** A button of the Shop section (outside the product cards), by its visible name. */
  button(name: string): Locator {
    return this.shopSection.getByRole('button', { name, exact: true });
  }

  async clickButton(name: string): Promise<void> {
    await this.button(name).click();
  }

  productsInCategory(category: string): Locator {
    return this.root.locator(`//article[contains(@class,'card')][.//*[contains(@class,'card-cat')][normalize-space()='${category}']]`);
  }

  productsOutsideCategory(category: string): Locator {
    return this.root.locator(`//article[contains(@class,'card')][.//*[contains(@class,'card-cat')][normalize-space()!='${category}']]`);
  }

  /** The products whose card shows a state ("Out of stock"). */
  productsWithStatus(status: string): Locator {
    return this.root.locator(`//article[contains(@class,'card')][.//*[normalize-space()='${status}']]`);
  }

  /** A button (by its visible name) of the product that shows a state. */
  productWithStatusButton(status: string, name: string): Locator {
    // The scenario names no product: any product with that state serves.
    const product = this.productsWithStatus(status).first(); // TODO(testability): no stock state in the shop yet
    return product.getByRole('button', { name, exact: true });
  }

  async viewProductWithStatus(status: string): Promise<void> {
    // The scenario names no product: any product with that state serves.
    const product = this.productsWithStatus(status).first(); // TODO(testability): no stock state in the shop yet
    await product.scrollIntoViewIfNeeded();
  }

  async sortBy(option: string): Promise<void> {
    await this.sortSelect.selectOption({ label: option });
  }

  /** The prices of the listed products, in the order the grid shows them. */
  async priceValues(): Promise<number[]> {
    return (await this.productPrices.allTextContents()).map(parseUsd);
  }

  async search(term: string): Promise<void> {
    await this.searchBox.fill(term);
    await this.searchBox.press('Enter');
  }

  /** The text of each listed product card. */
  async productTexts(): Promise<string[]> {
    return this.productCards.allInnerTexts();
  }

  /** A message the Shop section shows. */
  message(text: string): Locator {
    return this.root.getByText(text);
  }
}
