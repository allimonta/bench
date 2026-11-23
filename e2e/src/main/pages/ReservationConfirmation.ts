import { type Locator, type Page, expect } from '@playwright/test';

// The reservation confirmation (root: <aside id="reserveDrawer">, the same panel as the form): shown in place of the
// form after a valid submit, with the tracking number, the status and a preview of the email sent.
export class ReservationConfirmation {
  readonly title: Locator;
  readonly closeButton: Locator;
  readonly confirmation: Locator;
  readonly trackingNumber: Locator;
  readonly status: Locator;
  readonly emailSentTo: Locator;
  readonly emailPreview: Locator;
  readonly emailParts: Locator;
  readonly emailTotalPieces: Locator;
  readonly emailTransportCost: Locator;
  readonly emailPaymentMethod: Locator;
  readonly makeAnotherReservationButton: Locator;
  readonly trackingLine: Locator;
  readonly paymentHold: Locator;
  readonly emailSent: Locator;
  readonly emailTo: Locator;
  readonly emailSubject: Locator;
  readonly emailCompany: Locator;
  readonly emailRequester: Locator;
  readonly emailPartLines: Locator;
  readonly emailTracking: Locator;
  readonly emailStatus: Locator;
  private readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator("//*[@id='reserveDrawer']");
    this.title = this.root.locator("//*[@id='reserveTitle']");
    this.closeButton = this.root.locator("//*[@id='closeReserve']");
    this.confirmation = this.root.getByTestId('reservation-confirmation');
    this.trackingNumber = this.root.getByTestId('tracking-number');
    this.status = this.root.getByTestId('reservation-status');
    this.emailSentTo = this.root.getByTestId('email-sent-to');
    this.emailPreview = this.root.getByTestId('email-preview');
    this.emailParts = this.root.getByTestId('email-parts');
    this.emailTotalPieces = this.root.getByTestId('email-total-pieces');
    this.emailTransportCost = this.root.getByTestId('email-transport-cost');
    this.emailPaymentMethod = this.root.getByTestId('email-payment');
    this.makeAnotherReservationButton = this.root.locator("//*[@id='newReservation']");
    this.trackingLine = this.confirmation.locator("//p[.//*[@data-testid='tracking-number']]");
    this.paymentHold = this.root.getByTestId('payment-hold');
    this.emailSent = this.root.getByTestId('email-sent');
    this.emailTo = this.root.getByTestId('email-to');
    this.emailSubject = this.root.getByTestId('email-subject');
    this.emailCompany = this.root.getByTestId('email-company');
    this.emailRequester = this.root.getByTestId('email-requester');
    this.emailPartLines = this.emailParts.locator('//li'); // a list: one line per reserved part
    this.emailTracking = this.root.getByTestId('email-tracking');
    this.emailStatus = this.root.getByTestId('email-status');
  }

  /** Synchronization: the confirmation has replaced the form. */
  async expectLoaded(): Promise<void> {
    await expect(this.confirmation).toBeVisible();
  }

  /** The heading of the email preview, by its text ("Email sent"). */
  emailHeading(name: string): Locator {
    return this.emailPreview.getByRole('heading', { name, exact: true });
  }

  /** The lines of the email's parts list that name a part. */
  emailPartLinesNaming(part: string): Locator {
    return this.emailPartLines.filter({ hasText: part });
  }

  async trackingNumberText(): Promise<string> {
    await expect(this.trackingNumber).toHaveText(/\S/);
    return ((await this.trackingNumber.textContent()) ?? '').trim();
  }

  async makeAnotherReservation(): Promise<void> {
    await this.makeAnotherReservationButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }

  /** The confirmation's heading, by its text ("Parts reserved"). */
  heading(name: string): Locator {
    return this.confirmation.getByRole('heading', { name, exact: true });
  }

  /** A line of the parts list of the email sent, by its exact text ("600 × Servo Arm Assembly"). */
  emailPart(line: string): Locator {
    return this.emailParts.getByText(line, { exact: true });
  }

  /** A button of the confirmation, by its visible name. */
  button(name: string): Locator {
    return this.confirmation.getByRole('button', { name, exact: true });
  }

  async clickButton(name: string): Promise<void> {
    await this.button(name).click();
  }
}
