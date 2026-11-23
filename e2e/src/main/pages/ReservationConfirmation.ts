import { type Locator, type Page } from '@playwright/test';

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
