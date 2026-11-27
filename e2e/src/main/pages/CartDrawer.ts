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
  /** The volume discount amount (row "Volume discount (5%)", shown only at 3 or more pieces, with a leading "−"). */
  readonly discount: Locator;
  readonly shipping: Locator;
  /** The volume discount note under the summary ("Add N more part(s) to get 5% off." / "Volume discount applied: …"). */
  readonly volumeNote: Locator;
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
  /** The reference of a placed order ("PW-" and a random code), inside the order confirmation. */
  readonly orderReference: Locator;
  /** The cart's heading as assistive technology exposes it: hidden once the cart closes (it becomes aria-hidden). */
  readonly exposedHeading: Locator;
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
    this.discount = this.root.getByTestId('cart-discount');
    this.shipping = this.root.getByTestId('cart-shipping');
    this.volumeNote = this.root.getByTestId('volume-discount-note'); // changed by hand: use the test id, not the CSS class
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
    this.orderReference = this.orderConfirmation.getByTestId('order-ref');
    this.exposedHeading = this.root.getByRole('heading', { name: 'Your cart', exact: true });
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

  /** The "Increase quantity" button of a line, by the name of its part. */
  increaseButtonOf(part: string): Locator {
    return this.root.locator(`//button[@aria-label='Increase quantity of ${part}']`);
  }

  /** Raises the quantity of a line by one, by the name of its part (the cart re-renders, the pop-up stays open). */
  async increaseQuantityOf(part: string): Promise<void> {
    await this.increaseButtonOf(part).click();
  }

  /** The quantity a line shows, by the name of its part. */
  lineQuantity(part: string): Locator {
    return this.lineNamed(part).locator("//div[contains(@class,'qty')]/span");
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
