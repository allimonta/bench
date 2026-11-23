import { type Locator, type Page } from '@playwright/test';

// The detail view of a product. TODO(testability): the shop has no product detail view yet (TC-VOLUME1-017: clicking a
// product name does nothing); it is expected as a dialog named after the product — suggest an id for it when it is built.
export class ProductDetailView {
  constructor(private readonly page: Page) {}

  /** The detail view of a product, by the product's name. */
  view(productName: string): Locator {
    return this.page.getByRole('dialog', { name: productName });
  }

  /** A text the detail view shows (the description, the price). */
  text(productName: string, text: string): Locator {
    return this.view(productName).getByText(text, { exact: false });
  }

  /** The compatibility information of the product. */
  compatibilityInfo(productName: string): Locator {
    return this.view(productName).getByText(/compatib/i);
  }
}
