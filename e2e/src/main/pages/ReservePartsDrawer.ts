import { type Locator, type Page, expect } from '@playwright/test';

// The "Reserve parts" panel with its reservation form (root: <aside id="reserveDrawer" role="dialog">).
// After a valid submit the same panel shows the confirmation instead of the form: that is ReservationConfirmation.
// The form re-renders when the panel opens and after "Make another reservation", so every element is located when used.
export class ReservePartsDrawer {
  readonly title: Locator;
  readonly closeButton: Locator;
  readonly form: Locator;
  readonly quantityLines: Locator;
  readonly totalPieces: Locator;
  readonly transportCost: Locator;
  readonly companyField: Locator;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly emailField: Locator;
  readonly checkRadio: Locator;
  readonly bankTransferRadio: Locator;
  readonly creditCardRadio: Locator;
  readonly errors: Locator;
  readonly reserveButton: Locator;
  private readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator("//*[@id='reserveDrawer']");
    this.title = this.root.locator("//*[@id='reserveTitle']");
    this.closeButton = this.root.locator("//*[@id='closeReserve']");
    this.form = this.root.locator("//*[@id='reserveForm']");
    this.quantityLines = this.root.locator("//div[contains(@class,'qty-line')]"); // a list: one line per part
    this.totalPieces = this.root.locator("//*[@id='reserveTotalPieces']");
    this.transportCost = this.root.locator("//*[@id='reserveTransport']");
    this.companyField = this.root.locator("//*[@id='rCompany']");
    this.firstNameField = this.root.locator("//*[@id='rFirst']");
    this.lastNameField = this.root.locator("//*[@id='rLast']");
    this.emailField = this.root.locator("//*[@id='rEmail']");
    this.checkRadio = this.root.getByRole('radio', { name: 'Check', exact: true });
    this.bankTransferRadio = this.root.getByRole('radio', { name: 'Bank transfer', exact: true });
    this.creditCardRadio = this.root.getByRole('radio', { name: 'Credit card', exact: true });
    this.errors = this.root.locator("//*[@id='reserveErrors']");
    this.reserveButton = this.root.locator("//*[@id='reserveSubmit']");
  }

  /** The panel is open: its heading is exposed (a closed panel is aria-hidden). */
  async expectLoaded(): Promise<void> {
    await expect(this.heading('Reserve parts')).toBeVisible();
  }

  /** The panel's heading, by its text. */
  heading(name: string): Locator {
    return this.root.getByRole('heading', { name, exact: true });
  }

  /**
   * The quantity field of a part, by the part's name (its label). The inputs have ids rq-<productId>, a number the
   * app writes from its catalog; the part's name tells them apart inside the panel.
   */
  quantityField(part: string): Locator {
    return this.form.getByRole('spinbutton', { name: part, exact: true });
  }

  async enterQuantity(part: string, quantity: string): Promise<void> {
    await this.quantityField(part).fill(quantity);
  }

  async enterCompany(company: string): Promise<void> {
    await this.companyField.fill(company);
  }

  async enterFirstName(firstName: string): Promise<void> {
    await this.firstNameField.fill(firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    await this.lastNameField.fill(lastName);
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailField.fill(email);
  }

  /** A payment method option, by its label ("Check", "Bank transfer", "Credit card"). */
  paymentOption(method: string): Locator {
    return this.form.getByRole('radio', { name: method, exact: true });
  }

  async choosePaymentMethod(method: string): Promise<void> {
    await this.paymentOption(method).check();
  }

  /** A button of the reservation form, by its visible name. */
  button(name: string): Locator {
    return this.form.getByRole('button', { name, exact: true });
  }

  async clickButton(name: string): Promise<void> {
    await this.button(name).click();
  }

  /** One error of the form's error list, by its exact text. */
  error(text: string): Locator {
    return this.errors.getByText(text, { exact: true });
  }
}
