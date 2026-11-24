import { type Locator, type Page, expect } from '@playwright/test';
import type { ShopProduct } from '@data/products';
import { parseUsd } from '@utils/money';

// The cart pop-up (root: <aside id="drawer" role="dialog">). Its content re-renders on every add, quantity change
// or removal, so every element is located when it is used.
export class CartDrawer {
  readonly heading: Locator;
  readonly closeButton: Locator;
  readonly items: Locator;
  readonly removeButtons: Locator;
  readonly emptyMessage: Locator;
  readonly emptyImage: Locator;
  readonly subtotal: Locator;
  readonly total: Locator;
  readonly placeOrderButton: Locator;
  readonly orderConfirmation: Locator;
  readonly continueShoppingButton: Locator;
  // TODO(testability): the cart has no checkout form yet (TC-VOLUME1-001/022): suggest an id for it when it is built.
  readonly checkoutForm: Locator;
  readonly emailField: Locator;
  readonly requiredFields: Locator;
  readonly fieldErrors: Locator;
  // TODO(testability): the cart has no discount code field yet (TC-VOLUME1-023/024): suggest an id when it is built.
  readonly discountCodeField: Locator;
  readonly applyDiscountButton: Locator;
  // TODO(testability): the cart asks no confirmation before removing a line (TC-VOLUME1-019).
  readonly removalConfirmation: Locator;
  private readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator("//*[@id='drawer']");
    this.heading = this.root.locator("//*[@id='cartTitle']");
    this.closeButton = this.root.locator("//*[@id='closeCart']");
    this.items = this.root.locator("//li[contains(@class,'item')]");
    this.removeButtons = this.root.locator("//button[contains(@class,'remove')]");
    this.emptyMessage = this.root.getByTestId('cart-empty');
    this.emptyImage = this.root.getByTestId('cart-empty-image');
    this.subtotal = this.root.getByTestId('cart-subtotal');
    this.total = this.root.getByTestId('cart-total');
    this.placeOrderButton = this.root.locator("//*[@id='checkout']");
    this.orderConfirmation = this.root.locator("//div[contains(@class,'confirm')]");
    this.continueShoppingButton = this.root.locator("//*[@id='continue']");
    this.checkoutForm = this.root.locator('//form');
    this.emailField = this.checkoutForm.getByLabel('Email');
    this.requiredFields = this.checkoutForm.locator("//*[@required or @aria-required='true']");
    this.fieldErrors = this.checkoutForm.getByRole('alert');
    this.discountCodeField = this.root.getByRole('textbox', { name: 'Discount code' });
    this.applyDiscountButton = this.root.getByRole('button', { name: 'Apply', exact: true });
    this.removalConfirmation = this.root.getByRole('alertdialog');
  }

  /** Synchronization: the cart is open. */
  async expectLoaded(): Promise<void> {
    await expect(this.root).toHaveAttribute('aria-hidden', 'false');
    await expect(this.heading).toBeVisible();
  }

  lineItem(id: string): Locator {
    return this.root.locator(`//li[contains(@class,'item')][@data-product-id='${id}']`);
  }

  /** A line of the cart, by the name of its part. */
  lineNamed(name: string): Locator {
    return this.root.locator(`//li[contains(@class,'item')][.//*[contains(@class,'item-name')][normalize-space()='${name}']]`);
  }

  /** Removes a line by the name of its part (the cart re-renders, the pop-up stays open). */
  async removePart(name: string): Promise<void> {
    await this.lineNamed(name).locator("//button[contains(@class,'remove')]").click();
  }

  quantity(id: string): Locator {
    return this.root.getByTestId(`qty-${id}`);
  }

  lineTotal(id: string): Locator {
    return this.root.getByTestId(`line-total-${id}`);
  }

  increaseButton(product: ShopProduct): Locator {
    return this.root.locator(`//button[@aria-label='Increase quantity of ${product.name}']`);
  }

  decreaseButton(product: ShopProduct): Locator {
    return this.root.locator(`//button[@aria-label='Decrease quantity of ${product.name}']`);
  }

  /** The quantity of a line still showing `quantity`, or a confirmation asked before removing the line. */
  quantityOrRemovalConfirmation(id: string, quantity: number): Locator {
    return this.quantity(id).filter({ hasText: new RegExp(`^${quantity}$`) }).or(this.removalConfirmation);
  }

  async removeProduct(id: string): Promise<void> {
    await this.lineItem(id).locator("//button[contains(@class,'remove')]").click();
  }

  /** Brings a line to `target` with its +/- buttons (the cart has no quantity field). */
  async setQuantity(product: ShopProduct, target: number): Promise<void> {
    await expect(this.quantity(product.id)).toHaveText(/^\d+$/);
    const current = Number(await this.quantity(product.id).textContent());
    for (let q = current; q < target; q++) {
      await this.increaseButton(product).click();
      await expect(this.quantity(product.id)).toHaveText(String(q + 1));
    }
    for (let q = current; q > target; q--) {
      await this.decreaseButton(product).click();
      // at 0 the line is gone: there is no quantity left to wait for
      if (q - 1 > 0) await expect(this.quantity(product.id)).toHaveText(String(q - 1));
    }
  }

  async totalAmount(): Promise<number> {
    await expect(this.total).toBeVisible();
    return parseUsd((await this.total.textContent()) ?? '');
  }

  async enterEmailAndSubmit(email: string): Promise<void> {
    await this.emailField.fill(email);
    await this.placeOrderButton.click();
  }

  async submitCheckoutForm(): Promise<void> {
    await this.placeOrderButton.click();
  }

  async applyDiscountCode(code: string): Promise<void> {
    await this.discountCodeField.fill(code);
    await this.applyDiscountButton.click();
  }

  /** A message the cart shows. */
  message(text: string): Locator {
    return this.root.getByText(text);
  }

  /** A message the checkout form shows. */
  formMessage(text: string): Locator {
    return this.checkoutForm.getByText(text);
  }
}
