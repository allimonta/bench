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
  /** The panel's title as assistive technology exposes it: hidden once the panel closes (it becomes aria-hidden). */
  readonly exposedTitle: Locator;
  readonly hint: Locator;
  readonly sectionTitles: Locator;
  readonly quantityFields: Locator;
  readonly paymentOptions: Locator;
  readonly selectedPaymentOptions: Locator;
  readonly errorItems: Locator;
  readonly paymentNote: Locator;
  /**
   * The dimmed layer the panel opens over the page (shared with the cart pop-up). It is outside the panel's root: it
   * belongs to the page, and a click on it closes the panel.
   */
  readonly overlay: Locator;
  private readonly root: Locator;

  constructor(private readonly page: Page) {
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
    this.exposedTitle = this.root.getByRole('heading', { name: 'Reserve parts', exact: true });
    this.hint = this.form.locator("//p[contains(@class,'hint')]");
    this.sectionTitles = this.form.locator('//fieldset/legend'); // a list: one title per section
    this.quantityFields = this.form.getByRole('spinbutton'); // a list: one field per part
    this.paymentOptions = this.form.getByRole('radio');
    this.selectedPaymentOptions = this.form.getByRole('radio', { checked: true });
    this.errorItems = this.errors.locator('//li'); // a list: one item per error
    this.paymentNote = this.form.locator("//p[contains(@class,'hold-note')]");
    this.overlay = page.locator("//*[@id='overlay']");
  }

  /**
   * The panel has finished sliding in (0.3 s transform): its right edge is at the right edge of the viewport. Geometry
   * read before that is offset.
   */
  async expectSettled(): Promise<void> {
    await expect
      .poll(async () => {
        const box = await this.root.boundingBox();
        const viewport = this.page.viewportSize();
        return !!box && !!viewport && Math.round(box.x + box.width) === viewport.width;
      })
      .toBe(true);
  }

  /** A value of the "Total pieces" / "Transport cost" rows, by the row's label. */
  totalValue(label: string): Locator {
    return this.form.locator(`//div[contains(@class,'reserve-totals')]//span[normalize-space()='${label}']/following-sibling::span`);
  }

  /** A field of the form, by its label ("Company", "Last name(s)"). */
  field(label: string): Locator {
    return this.form.getByLabel(label, { exact: true });
  }

  /** The submit button of the form, by its visible name. */
  submitButton(name: string): Locator {
    return this.form.getByRole('button', { name, exact: true }).and(this.form.locator("//button[@type='submit']"));
  }

  async clearQuantity(part: string): Promise<void> {
    await this.quantityField(part).fill('');
  }

  async clearAllQuantities(): Promise<void> {
    for (const field of await this.quantityFields.all()) await field.fill('');
  }

  /** Fills the "Requested by" section. An empty value leaves its field empty. */
  async fillRequester(company: string, firstName: string, lastName: string, email: string): Promise<void> {
    await this.enterCompany(company);
    await this.enterFirstName(firstName);
    await this.enterLastName(lastName);
    await this.enterEmail(email);
  }

  async submit(): Promise<void> {
    await this.reserveButton.click();
  }

  async pressEnterInEmail(): Promise<void> {
    await this.emailField.press('Enter');
  }

  async pressEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  /** Clicks the dimmed layer outside the panel (its top left corner: the panel is on the right). */
  async clickOutside(): Promise<void> {
    await this.overlay.click({ position: { x: 10, y: 10 } });
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }

  /** What the form holds: the value of every field that is not empty and the label of every selected payment option. */
  async enteredValues(): Promise<string[]> {
    const values = (await this.form.locator("//input[not(@type='radio')]").evaluateAll((inputs) =>
      inputs.map((input) => (input as HTMLInputElement).value),
    )).filter((value) => value !== '');
    const selected = await this.selectedPaymentOptions.evaluateAll((radios) => radios.map((radio) => (radio as HTMLInputElement).value));
    return [...values, ...selected];
  }

  /** How many pixels the form's content overflows its width (0 or less: no horizontal scroll). */
  async horizontalOverflow(): Promise<number> {
    return this.form.evaluate((el) => el.scrollWidth - el.clientWidth);
  }

  /** Whether "Last name(s)" is below "First name" with the same left edge (stacked, not side by side). */
  async nameFieldsStacked(): Promise<boolean> {
    const first = await this.firstNameField.boundingBox();
    const last = await this.lastNameField.boundingBox();
    if (!first || !last) return false;
    return last.y >= first.y + first.height && Math.abs(last.x - first.x) < 1;
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
