import { expect } from '@playwright/test';
import { When, Then } from '@fixtures';

// Steps of the "Reserve parts" panel: the reservation form and, after a valid submit, the reservation confirmation.
// Reservations live in the browser's localStorage and cannot be cancelled (no screen and no endpoint deletes one):
// every scenario gets a fresh browser context, so it starts without reservations and leaves none behind.

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---- Reservation form ----

When('the user enters the company {string}', async ({ reservePartsDrawer }, company: string) => {
  await reservePartsDrawer.enterCompany(company);
});

When('the user enters the first name {string}', async ({ reservePartsDrawer }, firstName: string) => {
  await reservePartsDrawer.enterFirstName(firstName);
});

When('the user enters the last name {string}', async ({ reservePartsDrawer }, lastName: string) => {
  await reservePartsDrawer.enterLastName(lastName);
});

// TestGraph decision node (the last step of the shared Background): it asks a question the scenario's own steps answer,
// so there is nothing to do here. Each scenario below is one answer.
When('Is the reservation accepted?', async () => {});

When('the user enters the {string} reserved quantity {string}', async ({ reservePartsDrawer }, part: string, quantity: string) => {
  await reservePartsDrawer.enterQuantity(part, quantity);
});

When('the user enters the confirmation email {string}', async ({ reservePartsDrawer }, email: string) => {
  await reservePartsDrawer.enterEmail(email);
});

When('the user chooses the payment method {string}', async ({ reservePartsDrawer }, method: string) => {
  await reservePartsDrawer.choosePaymentMethod(method);
});

When('the user clicks the reservation form {string} button', async ({ reservePartsDrawer }, button: string) => {
  await reservePartsDrawer.clickButton(button);
});

Then('the {string} panel is shown', async ({ reservePartsDrawer }, panel: string) => {
  await expect(reservePartsDrawer.heading(panel), `the "${panel}" panel is not shown`).toBeVisible();
});

// expected: the reservation total pieces reads "<pieces>"
Then('the reservation total pieces reads {string}', async ({ reservePartsDrawer }, pieces: string) => {
  await expect(reservePartsDrawer.totalPieces, `the reservation total pieces do not read "${pieces}"`).toHaveText(pieces);
});

// expected: the reservation transport cost reads "<cost>"
Then('the reservation transport cost reads {string}', async ({ reservePartsDrawer }, cost: string) => {
  await expect(reservePartsDrawer.transportCost, `the reservation transport cost does not read "${cost}"`).toHaveText(cost);
});

// expected: the reservation form shows the error "<message>"
Then('the reservation form shows the error {string}', async ({ reservePartsDrawer }, message: string) => {
  await expect(reservePartsDrawer.error(message), `the reservation form does not show the error "${message}"`).toBeVisible();
});

// expected: the reservation form is shown
Then('the reservation form is shown', async ({ reservePartsDrawer }) => {
  await expect(reservePartsDrawer.form, 'the reservation form is not shown').toBeVisible();
});

// ---- Reservation confirmation ----

When('the user clicks the confirmation {string} button', async ({ reservationConfirmation }, button: string) => {
  await reservationConfirmation.clickButton(button);
});

// expected: the "<heading>" confirmation is shown
Then('the {string} confirmation is shown', async ({ reservationConfirmation }, heading: string) => {
  await expect(reservationConfirmation.heading(heading), `the "${heading}" confirmation is not shown`).toBeVisible();
});

// expected: the confirmation shows a tracking number starting with "<prefix>"
Then('the confirmation shows a tracking number starting with {string}', async ({ reservationConfirmation }, prefix: string) => {
  await expect(reservationConfirmation.trackingNumber, `the confirmation shows no tracking number starting with "${prefix}"`).toHaveText(
    new RegExp(`^${escapeRegExp(prefix)}\\S+$`),
  );
});

// expected: the reservation status reads "<status>"
Then('the reservation status reads {string}', async ({ reservationConfirmation }, status: string) => {
  await expect(reservationConfirmation.status, `the reservation status does not read "${status}"`).toHaveText(status);
});

// expected: the confirmation says the details were sent to "<email>"
Then('the confirmation says the details were sent to {string}', async ({ reservationConfirmation }, email: string) => {
  await expect(reservationConfirmation.emailSentTo, `the confirmation does not say the details were sent to "${email}"`).toHaveText(email);
});

// expected: the email sent lists the part "<quantity> × <part>"
Then('the email sent lists the part {string}', async ({ reservationConfirmation }, line: string) => {
  await expect(reservationConfirmation.emailPart(line), `the email sent does not list the part "${line}"`).toBeVisible();
});

// expected: the email sent shows the total pieces "<pieces>"
Then('the email sent shows the total pieces {string}', async ({ reservationConfirmation }, pieces: string) => {
  await expect(reservationConfirmation.emailTotalPieces, `the email sent does not show the total pieces "${pieces}"`).toHaveText(pieces);
});

// expected: the email sent shows the transport cost "<cost>"
Then('the email sent shows the transport cost {string}', async ({ reservationConfirmation }, cost: string) => {
  await expect(reservationConfirmation.emailTransportCost, `the email sent does not show the transport cost "${cost}"`).toHaveText(cost);
});

// expected: the email sent shows the payment method "<method>"
Then('the email sent shows the payment method {string}', async ({ reservationConfirmation }, method: string) => {
  await expect(reservationConfirmation.emailPaymentMethod, `the email sent does not show the payment method "${method}"`).toHaveText(method);
});
