import { expect } from '@playwright/test';
import { Given, When, Then } from '@fixtures';
import { email } from '@data/generators';
import type { ReservePartsDrawer } from '@pages/ReservePartsDrawer';
import type { FindReservationDrawer } from '@pages/FindReservationDrawer';

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

// ---- Reservation form (reserve-parts-manual-cases) ----

When(
  'the user reserves {int} {string} as {string} {string} of {string} with email {string} paying by {string}',
  async (
    { appHeader, reservePartsDrawer, ctx },
    quantity: number,
    part: string,
    firstName: string,
    lastName: string,
    company: string,
    email: string,
    payment: string,
  ) => {
    await appHeader.openReserve();
    await reservePartsDrawer.expectLoaded();
    await reservePartsDrawer.enterQuantity(part, String(quantity));
    await reservePartsDrawer.fillRequester(company, firstName, lastName, email);
    await reservePartsDrawer.choosePaymentMethod(payment);
    ctx.set('reservationRequester', { company, firstName, lastName, email, payment });
    await reservePartsDrawer.submit();
  },
);

// Quantities are typed as written ("01000", "1000.5", "-5"): {word} keeps them as text.
When('the user enters {word} {string}', async ({ reservePartsDrawer }, quantity: string, part: string) => {
  await reservePartsDrawer.enterQuantity(part, quantity);
});

When(
  'the user enters {word} {string} and {word} {string}',
  async ({ reservePartsDrawer }, firstQuantity: string, firstPart: string, secondQuantity: string, secondPart: string) => {
    await reservePartsDrawer.enterQuantity(firstPart, firstQuantity);
    await reservePartsDrawer.enterQuantity(secondPart, secondQuantity);
  },
);

When(
  'the user enters {word} {string}, {word} {string} and {word} {string}',
  async (
    { reservePartsDrawer },
    firstQuantity: string,
    firstPart: string,
    secondQuantity: string,
    secondPart: string,
    thirdQuantity: string,
    thirdPart: string,
  ) => {
    await reservePartsDrawer.enterQuantity(firstPart, firstQuantity);
    await reservePartsDrawer.enterQuantity(secondPart, secondQuantity);
    await reservePartsDrawer.enterQuantity(thirdPart, thirdQuantity);
  },
);

// The other quantity fields of a freshly opened form are already empty: nothing to type in them.
When(
  'the user enters {word} {string} and leaves every other part empty',
  async ({ reservePartsDrawer }, quantity: string, part: string) => {
    await reservePartsDrawer.enterQuantity(part, quantity);
  },
);

When('the user clears every quantity', async ({ reservePartsDrawer }) => {
  await reservePartsDrawer.clearAllQuantities();
});

When('the user clears the {string} quantity', async ({ reservePartsDrawer }, part: string) => {
  await reservePartsDrawer.clearQuantity(part);
});

When('the user changes the {string} quantity to {int}', async ({ reservePartsDrawer }, part: string, quantity: number) => {
  await reservePartsDrawer.enterQuantity(part, String(quantity));
});

When(
  'the user fills the requester {string}, {string}, {string}, {string} and the payment {string}',
  async ({ reservePartsDrawer }, company: string, firstName: string, lastName: string, email: string, payment: string) => {
    await reservePartsDrawer.fillRequester(company, firstName, lastName, email);
    await reservePartsDrawer.choosePaymentMethod(payment);
  },
);

When(
  'the user fills the requester {string}, {string}, {string}, {string} and no payment method',
  async ({ reservePartsDrawer }, company: string, firstName: string, lastName: string, email: string) => {
    await reservePartsDrawer.fillRequester(company, firstName, lastName, email);
  },
);

When('the user submits the reservation', async ({ reservePartsDrawer }) => {
  await reservePartsDrawer.submit();
});

// The form was just opened: every field is still empty.
When('the user submits the reservation with no field filled', async ({ reservePartsDrawer }) => {
  await reservePartsDrawer.submit();
});

// The form was just opened: every field is still empty.
When('the user submits the reservation with every field empty', async ({ reservePartsDrawer }) => {
  await reservePartsDrawer.submit();
});

When('the user presses Enter in the email field', async ({ reservePartsDrawer }) => {
  await reservePartsDrawer.pressEnterInEmail();
});

When('the user presses Escape', async ({ reservePartsDrawer }) => {
  await reservePartsDrawer.pressEscape();
});

When('the user clicks outside the reservation form', async ({ reservePartsDrawer }) => {
  await reservePartsDrawer.clickOutside();
});

When('the user clicks the close button of the reservation form', async ({ reservePartsDrawer }) => {
  await reservePartsDrawer.close();
});

// expected[0]: "<label>" shows "<value>" and "<label>" shows "<value>"
Then(
  '{string} shows {string} and {string} shows {string}',
  async ({ reservePartsDrawer }, firstLabel: string, firstValue: string, secondLabel: string, secondValue: string) => {
    await expect(reservePartsDrawer.totalValue(firstLabel), `"${firstLabel}" does not show "${firstValue}"`).toHaveText(firstValue);
    await expect(reservePartsDrawer.totalValue(secondLabel), `"${secondLabel}" does not show "${secondValue}"`).toHaveText(secondValue);
  },
);

// expected[0]: "<label>" shows "<value>" and "<label>" shows "<value>" after clearing
Then(
  '{string} shows {string} and {string} shows {string} after clearing',
  async ({ reservePartsDrawer }, firstLabel: string, firstValue: string, secondLabel: string, secondValue: string) => {
    await expect(reservePartsDrawer.totalValue(firstLabel), `"${firstLabel}" does not show "${firstValue}" after clearing`).toHaveText(firstValue);
    await expect(reservePartsDrawer.totalValue(secondLabel), `"${secondLabel}" does not show "${secondValue}" after clearing`).toHaveText(
      secondValue,
    );
  },
);

// expected[0]: "<label>" shows "<value>" and "<label>" shows "<value>" for the three parts
Then(
  '{string} shows {string} and {string} shows {string} for the three parts',
  async ({ reservePartsDrawer }, firstLabel: string, firstValue: string, secondLabel: string, secondValue: string) => {
    await expect(reservePartsDrawer.totalValue(firstLabel), `"${firstLabel}" does not show "${firstValue}" for the three parts`).toHaveText(
      firstValue,
    );
    await expect(reservePartsDrawer.totalValue(secondLabel), `"${secondLabel}" does not show "${secondValue}" for the three parts`).toHaveText(
      secondValue,
    );
  },
);

// expected[0]: "<label>" shows "<value>" for the quantity with leading zeros
Then('{string} shows {string} for the quantity with leading zeros', async ({ reservePartsDrawer }, label: string, value: string) => {
  await expect(reservePartsDrawer.totalValue(label), `"${label}" does not show "${value}" for the quantity with leading zeros`).toHaveText(value);
});

// expected[0]: the keyboard focus is on the close button of the reservation form
Then('the keyboard focus is on the close button of the reservation form', async ({ reservePartsDrawer }) => {
  await expect(reservePartsDrawer.closeButton, 'the keyboard focus is not on the close button of the reservation form').toBeFocused();
});

// expected[0]: the reservation form is hidden after Escape
Then('the reservation form is hidden after Escape', async ({ reservePartsDrawer }) => {
  await expect(reservePartsDrawer.exposedTitle, 'the reservation form is still shown after Escape').toBeHidden();
});

// expected[0]: the reservation form is hidden after the outside click
Then('the reservation form is hidden after the outside click', async ({ reservePartsDrawer }) => {
  await expect(reservePartsDrawer.exposedTitle, 'the reservation form is still shown after the outside click').toBeHidden();
});

// expected[0]: the reservation form is hidden
Then('the reservation form is hidden', async ({ reservePartsDrawer }) => {
  await expect(reservePartsDrawer.exposedTitle, 'the reservation form is still shown').toBeHidden();
});

// expected[0]: the error "<message>" is displayed
Then('the error {string} is displayed', async ({ reservePartsDrawer }, message: string) => {
  await expect(reservePartsDrawer.error(message), `the error "${message}" is not displayed`).toBeVisible();
});

// expected[0]: the error "<message>" is displayed for the one-letter domain
Then('the error {string} is displayed for the one-letter domain', async ({ reservePartsDrawer }, message: string) => {
  await expect(reservePartsDrawer.error(message), `the error "${message}" is not displayed for the one-letter domain`).toBeVisible();
});

// expected[0]: the error "<message>" is displayed for the blank company
Then('the error {string} is displayed for the blank company', async ({ reservePartsDrawer }, message: string) => {
  await expect(reservePartsDrawer.error(message), `the error "${message}" is not displayed for the blank company`).toBeVisible();
});

// expected[0]: the error "<message>" is displayed for the decimal quantity
Then('the error {string} is displayed for the decimal quantity', async ({ reservePartsDrawer }, message: string) => {
  await expect(reservePartsDrawer.error(message), `the error "${message}" is not displayed for the decimal quantity`).toBeVisible();
});

// expected[0]: <count> error messages are displayed
Then('{int} error messages are displayed', async ({ reservePartsDrawer }, count: number) => {
  await expect(reservePartsDrawer.errorItems, `the reservation form does not display ${count} error messages`).toHaveCount(count);
});

// expected[0]: the error messages read exactly "<m1>", … and "<m6>"
Then(
  'the error messages read exactly {string}, {string}, {string}, {string}, {string} and {string}',
  async ({ reservePartsDrawer }, m1: string, m2: string, m3: string, m4: string, m5: string, m6: string) => {
    const messages = [m1, m2, m3, m4, m5, m6];
    await expect(reservePartsDrawer.errorItems, `the error messages do not read exactly ${messages.join(' / ')}`).toHaveText(messages);
  },
);

// expected[0]: a quantity field is displayed for each of the eight parts
Then(
  'a quantity field is displayed for {string}, {string}, {string}, {string}, {string}, {string}, {string} and {string}',
  async ({ reservePartsDrawer }, p1: string, p2: string, p3: string, p4: string, p5: string, p6: string, p7: string, p8: string) => {
    for (const part of [p1, p2, p3, p4, p5, p6, p7, p8]) {
      await expect(reservePartsDrawer.quantityField(part), `no quantity field is displayed for "${part}"`).toBeVisible();
    }
  },
);

// expected[0]: the title "<title>" and the hint "<hint>" are displayed
Then('the title {string} and the hint {string} are displayed', async ({ reservePartsDrawer }, title: string, hint: string) => {
  await expect(reservePartsDrawer.title, `the reservation form title is not "${title}"`).toHaveText(title);
  await expect(reservePartsDrawer.hint, `the reservation form hint is not "${hint}"`).toHaveText(hint);
});

// expected[0]: the section titles read exactly "<t1>", "<t2>" and "<t3>"
Then(
  'the section titles read exactly {string}, {string} and {string}',
  async ({ reservePartsDrawer }, t1: string, t2: string, t3: string) => {
    await expect(reservePartsDrawer.sectionTitles, `the section titles do not read exactly "${t1}", "${t2}" and "${t3}"`).toHaveText([t1, t2, t3]);
  },
);

// expected[0]: the note "<note>" and the "<button>" submit button are displayed
Then('the note {string} and the {string} submit button are displayed', async ({ reservePartsDrawer }, note: string, button: string) => {
  await expect(reservePartsDrawer.paymentNote, `the reservation form note is not "${note}"`).toHaveText(note);
  await expect(reservePartsDrawer.submitButton(button), `the reservation form has no "${button}" submit button`).toBeVisible();
});

// expected[0]: the payment options "<o1>", "<o2>" and "<o3>" are displayed and none is selected
Then(
  'the payment options {string}, {string} and {string} are displayed and none is selected',
  async ({ reservePartsDrawer }, o1: string, o2: string, o3: string) => {
    for (const option of [o1, o2, o3]) {
      await expect(reservePartsDrawer.paymentOption(option), `the payment option "${option}" is not displayed`).toBeVisible();
    }
    await expect(reservePartsDrawer.selectedPaymentOptions, 'a payment option is already selected').toHaveCount(0);
  },
);

// expected[0]: the fields "<f1>", "<f2>", "<f3>" and "<f4>" are displayed
Then(
  'the fields {string}, {string}, {string} and {string} are displayed',
  async ({ reservePartsDrawer }, f1: string, f2: string, f3: string, f4: string) => {
    for (const label of [f1, f2, f3, f4]) {
      await expect(reservePartsDrawer.field(label), `the field "${label}" is not displayed`).toBeVisible();
    }
  },
);

// expected[0]: an empty reservation form is displayed
Then('an empty reservation form is displayed', async ({ reservePartsDrawer }) => {
  await expect(reservePartsDrawer.form, 'no reservation form is displayed').toBeVisible();
  await expect
    .poll(async () => reservePartsDrawer.enteredValues(), { message: 'the reservation form is not empty' })
    .toEqual([]);
});

// expected[0]: the reservation form has no horizontal scroll and the name fields are stacked
Then('the reservation form has no horizontal scroll and the name fields are stacked', async ({ reservePartsDrawer }) => {
  await expect
    .poll(async () => reservePartsDrawer.horizontalOverflow(), { message: 'the reservation form scrolls horizontally' })
    .toBeLessThanOrEqual(0);
  await expect
    .poll(async () => reservePartsDrawer.nameFieldsStacked(), { message: 'the name fields are not stacked' })
    .toBe(true);
});

// ---- Reservation confirmation (reserve-parts-manual-cases) ----

When('the user closes the reservation form', async ({ reservationConfirmation }) => {
  await reservationConfirmation.close();
});

When('the user closes the reservation form and opens it again', async ({ reservationConfirmation, appHeader, reservePartsDrawer }) => {
  await reservationConfirmation.close();
  await appHeader.openReserve();
  await reservePartsDrawer.expectLoaded();
});

// The same requester, and the same payment method, as the scenario's first reservation.
When(
  'the user makes another reservation of {int} {string} with the same requester',
  async ({ reservationConfirmation, reservePartsDrawer, ctx }, quantity: number, part: string) => {
    ctx.set('firstTrackingNumber', await reservationConfirmation.trackingNumberText());
    const requester = ctx.get('reservationRequester');
    await reservationConfirmation.makeAnotherReservation();
    await reservePartsDrawer.enterQuantity(part, String(quantity));
    await reservePartsDrawer.fillRequester(requester.company, requester.firstName, requester.lastName, requester.email);
    await reservePartsDrawer.choosePaymentMethod(requester.payment);
    await reservePartsDrawer.submit();
    await reservationConfirmation.expectLoaded();
  },
);

// expected[0]: the email sent shows the requester "<name>" and the company "<company>"
Then(
  'the email sent shows the requester {string} and the company {string}',
  async ({ reservationConfirmation }, requester: string, company: string) => {
    await expect(reservationConfirmation.emailRequester, `the email sent does not show the requester "${requester}"`).toHaveText(requester);
    await expect(reservationConfirmation.emailCompany, `the email sent does not show the company "${company}"`).toHaveText(company);
  },
);

// expected[0]: the reservation is confirmed with a tracking number
Then('the reservation is confirmed with a tracking number', async ({ reservationConfirmation }) => {
  await expect(reservationConfirmation.confirmation, 'the reservation is not confirmed').toBeVisible();
  await expect(reservationConfirmation.trackingNumber, 'the confirmation shows no tracking number').toHaveText(/\S/);
});

// expected[0]: the reservation is confirmed after pressing Enter
Then('the reservation is confirmed after pressing Enter', async ({ reservationConfirmation }) => {
  await expect(reservationConfirmation.confirmation, 'the reservation is not confirmed after pressing Enter').toBeVisible();
});

// expected[0]: the reservation of <pieces> combined pieces is confirmed
Then('the reservation of {word} combined pieces is confirmed', async ({ reservationConfirmation }, pieces: string) => {
  await expect(reservationConfirmation.confirmation, 'the reservation is not confirmed').toBeVisible();
  await expect(reservationConfirmation.emailTotalPieces, `the reservation is not of ${pieces} pieces`).toHaveText(pieces);
});

// expected[0]: the confirmation says "<text>"
Then('the confirmation says {string}', async ({ reservationConfirmation }, text: string) => {
  await expect(reservationConfirmation.confirmation, `the confirmation does not say "${text}"`).toContainText(text);
});

// expected[0]: the email sent is to "<email>" with the subject "<subject>" followed by the tracking number
Then(
  'the email sent is to {string} with the subject {string} followed by the tracking number',
  async ({ reservationConfirmation }, email: string, subject: string) => {
    await expect(reservationConfirmation.emailTo, `the email sent is not to "${email}"`).toHaveText(email);
    const tracking = await reservationConfirmation.trackingNumberText();
    await expect(reservationConfirmation.emailSubject, `the email subject is not "${subject} ${tracking}"`).toHaveText(`${subject} ${tracking}`);
  },
);

// expected[0]: the reservation status is "<status>"
Then('the reservation status is {string}', async ({ reservationConfirmation }, status: string) => {
  await expect(reservationConfirmation.status, `the reservation status is not "${status}"`).toHaveText(status);
});

// expected[0]: the second tracking number is different from the first
Then('the second tracking number is different from the first', async ({ reservationConfirmation, ctx }) => {
  const first = ctx.get('firstTrackingNumber');
  await expect(reservationConfirmation.trackingNumber, `the second tracking number is the same as the first (${first})`).not.toHaveText(first);
});

// expected[0]: the tracking number is "<prefix>" followed by <n> uppercase letters or digits
Then(
  'the tracking number is {string} followed by {int} uppercase letters or digits',
  async ({ reservationConfirmation }, prefix: string, length: number) => {
    await expect(
      reservationConfirmation.trackingNumber,
      `the tracking number is not "${prefix}" followed by ${length} uppercase letters or digits`,
    ).toHaveText(new RegExp(`^${escapeRegExp(prefix)}[A-Z0-9]{${length}}$`));
  },
);

// expected[0]: the confirmation reads "<heading>", "<tracking label>", "<button>" and the email section reads "<heading>"
Then(
  'the confirmation reads {string}, {string}, {string} and the email section reads {string}',
  async ({ reservationConfirmation }, heading: string, trackingLabel: string, button: string, emailHeading: string) => {
    await expect(reservationConfirmation.heading(heading), `the confirmation does not read "${heading}"`).toBeVisible();
    await expect(reservationConfirmation.trackingLine, `the confirmation does not read "${trackingLabel}"`).toContainText(trackingLabel);
    await expect(reservationConfirmation.button(button), `the confirmation does not read "${button}"`).toBeVisible();
    await expect(reservationConfirmation.emailHeading(emailHeading), `the email section does not read "${emailHeading}"`).toBeVisible();
  },
);

// expected[0]: the email sent shows the company as the literal text "<company>"
Then('the email sent shows the company as the literal text {string}', async ({ reservationConfirmation }, company: string) => {
  await expect(reservationConfirmation.emailCompany, `the email sent does not show the company as the literal text "${company}"`).toHaveText(
    company,
  );
});

// expected[0]: the email sent does not list "<part>"
Then('the email sent does not list {string}', async ({ reservationConfirmation }, part: string) => {
  await reservationConfirmation.expectLoaded();
  await expect(reservationConfirmation.emailPartLinesNaming(part), `the email sent lists "${part}"`).toHaveCount(0);
});

// expected[0]: the email sent lists only "<line>"
Then('the email sent lists only {string}', async ({ reservationConfirmation }, line: string) => {
  await expect(reservationConfirmation.emailPartLines, `the email sent does not list only "${line}"`).toHaveText([line]);
});

// expected[0]: the email sent lists "<line>" and "<line>" and no other part
Then(
  'the email sent lists {string} and {string} and no other part',
  async ({ reservationConfirmation }, first: string, second: string) => {
    await expect(reservationConfirmation.emailPartLines, `the email sent does not list only "${first}" and "${second}"`).toHaveText([
      first,
      second,
    ]);
  },
);

// expected[0]: the email sent shows total pieces "<pieces>" and transport cost "<cost>"
Then(
  'the email sent shows total pieces {string} and transport cost {string}',
  async ({ reservationConfirmation }, pieces: string, cost: string) => {
    await expect(reservationConfirmation.emailTotalPieces, `the email sent does not show total pieces "${pieces}"`).toHaveText(pieces);
    await expect(reservationConfirmation.emailTransportCost, `the email sent does not show transport cost "${cost}"`).toHaveText(cost);
  },
);

// ---- Reservation form (weird-names) ----

When('the user enters {int} pieces of {string} in the reservation form', async ({ appHeader, reservePartsDrawer }, pieces: number, part: string) => {
  await appHeader.openReserve();
  await reservePartsDrawer.expectLoaded();
  await reservePartsDrawer.enterQuantity(part, String(pieces));
});

When('the user opens the reservation form and enters {int} pieces of {string}', async ({ appHeader, reservePartsDrawer }, pieces: number, part: string) => {
  await appHeader.openReserve();
  await reservePartsDrawer.expectLoaded();
  await reservePartsDrawer.enterQuantity(part, String(pieces));
});

When('the user opens the reservation form and presses Escape', async ({ appHeader, reservePartsDrawer }) => {
  await appHeader.openReserve();
  await reservePartsDrawer.expectLoaded();
  await reservePartsDrawer.pressEscape();
});

// expected[0]: the transport cost shows "<cost>"
Then('the transport cost shows {string}', async ({ reservePartsDrawer }, cost: string) => {
  await expect(reservePartsDrawer.transportCost, `the transport cost does not show "${cost}"`).toHaveText(cost);
});

// expected[0]: the total pieces show "<pieces>"
Then('the total pieces show {string}', async ({ reservePartsDrawer }, pieces: string) => {
  await expect(reservePartsDrawer.totalPieces, `the total pieces do not show "${pieces}"`).toHaveText(pieces);
});

// The title names the panel (skill step-definitions, the same description on more than one screen): the step picks the
// panel by it, and that panel checks its own title.
const panelByTitle = (title: string, panels: { reservePartsDrawer: ReservePartsDrawer; findReservationDrawer: FindReservationDrawer }) => {
  const byTitle: Record<string, ReservePartsDrawer | FindReservationDrawer> = {
    'Reserve parts': panels.reservePartsDrawer,
    'Find a reservation': panels.findReservationDrawer,
  };
  if (!Object.hasOwn(byTitle, title)) throw new Error(`no panel titled "${title}": this step knows ${Object.keys(byTitle).join(', ')}`);
  return byTitle[title];
};

// expected[0]: the title "<title>" is displayed
Then('the title {string} is displayed', async ({ reservePartsDrawer, findReservationDrawer }, title: string) => {
  await expect(panelByTitle(title, { reservePartsDrawer, findReservationDrawer }).title, `the title "${title}" is not displayed`).toHaveText(title);
});

// ---- A reservation as a precondition (find-a-reservation) ----

// Creates the reservation through the "Reserve parts" panel, paying by credit card with a generated confirmation email,
// then closes the panel (it would cover the header). "Ana Torres": the first word is the first name, the rest the last
// name(s). No ctx.own and no cleanup: reservations live in this scenario's own browser context (localStorage) and no
// screen deletes one, so nothing is shared with another execution and nothing is left behind.
Given(
  'a reservation of {int} {string} pieces exists for {string} requested by {string}',
  async ({ appHeader, reservePartsDrawer, reservationConfirmation }, quantity: number, part: string, company: string, requester: string) => {
    const [firstName, ...lastNames] = requester.trim().split(/\s+/);
    await appHeader.openReserve();
    await reservePartsDrawer.expectLoaded();
    await reservePartsDrawer.enterQuantity(part, String(quantity));
    await reservePartsDrawer.fillRequester(company, firstName, lastNames.join(' '), email('reservation'));
    await reservePartsDrawer.choosePaymentMethod('Credit card');
    await reservePartsDrawer.submit();
    await reservationConfirmation.expectLoaded();
    await reservationConfirmation.close();
  },
);
