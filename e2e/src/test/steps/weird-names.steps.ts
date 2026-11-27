import { expect } from '@playwright/test';
import { When, Then } from '@fixtures';

// Steps of the "Find a reservation" panel: the reservation search and the list of reservations.
// Reservations live in the browser's localStorage: every scenario gets a fresh browser context, so it starts without
// reservations (nothing to create, nothing to clean up).

When('the user opens the reservation search', async ({ appHeader, findReservationDrawer }) => {
  await appHeader.openFind();
  await findReservationDrawer.expectLoaded();
});

// "with no reservations": a fresh browser context holds none (they live only in its localStorage).
When('the user opens the reservation search with no reservations', async ({ appHeader, findReservationDrawer }) => {
  await appHeader.openFind();
  await findReservationDrawer.expectLoaded();
});

When('the user searches for a reservation with an empty field', async ({ appHeader, findReservationDrawer }) => {
  await appHeader.openFind();
  await findReservationDrawer.expectLoaded();
  await findReservationDrawer.search('');
});

// expected[0]: every reservation is listed — the list is not filtered: its title reads "All reservations", with the
// count when there are reservations ("All reservations (N)").
Then('every reservation is listed', async ({ findReservationDrawer }) => {
  await expect(findReservationDrawer.reservationsTitle, 'the reservation list is filtered: not every reservation is listed').toHaveText(
    /^All reservations( \(\d+\))?$/,
  );
});

// expected[0]: the message "<message>" is displayed (the status line of the reservation search)
Then('the message {string} is displayed', async ({ findReservationDrawer }, message: string) => {
  await expect(findReservationDrawer.message, `the message "${message}" is not displayed`).toHaveText(message);
});

// ---- Search and the list of reservations (find-a-reservation) ----

// TestGraph decision node (the last step of the shared Background): each scenario below is one answer, nothing to do.
When('Does a reservation match the search?', async () => {});

When('the user enters the reservation search {string}', async ({ findReservationDrawer }, query: string) => {
  await findReservationDrawer.enterQuery(query);
});

When('the user clicks the reservation search {string} button', async ({ findReservationDrawer }, button: string) => {
  await findReservationDrawer.clickButton(button);
});

// The tracking code is random: it is read from the reservation's row, then typed in the search field.
When(
  'the user enters the code of the {string} reservation in the reservation search',
  async ({ findReservationDrawer }, company: string) => {
    await findReservationDrawer.enterQuery(await findReservationDrawer.codeOf(company));
  },
);

// expected: the reservation list title reads "<title>"
Then('the reservation list title reads {string}', async ({ findReservationDrawer }, title: string) => {
  await expect(findReservationDrawer.reservationsTitle, `the reservation list title does not read "${title}"`).toHaveText(title);
});

// expected: the first listed reservation is from "<company>" (the list is newest first)
Then('the first listed reservation is from {string}', async ({ findReservationDrawer }, company: string) => {
  await expect(findReservationDrawer.firstRowCompany(), `the first listed reservation is not from "${company}"`).toHaveText(company);
});

// expected: the reservation list title says "<matched>" of "<total>" reservations match "<query>"
Then(
  'the reservation list title says {string} of {string} reservations match {string}',
  async ({ findReservationDrawer }, matched: string, total: string, query: string) => {
    const title = `${matched} of ${total} reservations match "${query}"`;
    await expect(findReservationDrawer.reservationsTitle, `the reservation list title does not say ${title}`).toHaveText(title);
  },
);

// expected: the reservation list shows only the "<company>" reservation
Then('the reservation list shows only the {string} reservation', async ({ findReservationDrawer }, company: string) => {
  await expect(findReservationDrawer.rowCompanies, `the reservation list does not show only the "${company}" reservation`).toHaveText([
    company,
  ]);
});

// expected: the listed "<company>" reservation shows "<pieces>" pieces
Then('the listed {string} reservation shows {string} pieces', async ({ findReservationDrawer }, company: string, pieces: string) => {
  await expect(findReservationDrawer.cellOf(company, 'pieces'), `the listed "${company}" reservation does not show ${pieces} pieces`).toHaveText(
    pieces,
  );
});

// expected: the listed "<company>" reservation shows the amount "<amount>"
Then(
  'the listed {string} reservation shows the amount {string}',
  async ({ findReservationDrawer }, company: string, amount: string) => {
    await expect(findReservationDrawer.cellOf(company, 'amount'), `the listed "${company}" reservation does not show the amount ${amount}`).toHaveText(
      amount,
    );
  },
);

// expected: the listed "<company>" reservation shows the requester "<requester>"
Then(
  'the listed {string} reservation shows the requester {string}',
  async ({ findReservationDrawer }, company: string, requester: string) => {
    await expect(
      findReservationDrawer.cellOf(company, 'requester'),
      `the listed "${company}" reservation does not show the requester "${requester}"`,
    ).toHaveText(requester);
  },
);

// expected: the reservation search reports no match for "<query>" (its status line)
Then('the reservation search reports no match for {string}', async ({ findReservationDrawer }, query: string) => {
  await expect(findReservationDrawer.message, `the reservation search does not report no match for "${query}"`).toHaveText(
    `No reservation matches "${query}".`,
  );
});

// expected: the reservation list shows no reservation
Then('the reservation list shows no reservation', async ({ findReservationDrawer }) => {
  await expect(findReservationDrawer.reservationRows, 'the reservation list shows reservations').toHaveCount(0);
});

// expected: the reservation search field is empty
Then('the reservation search field is empty', async ({ findReservationDrawer }) => {
  await expect(findReservationDrawer.queryField, 'the reservation search field is not empty').toHaveValue('');
});

// ---- The Clear search button (clear-reservation-search) ----

// TestGraph decision node (the last step of the shared Background): each scenario below is one answer, nothing to do.
When('Does the search field hold a search term?', async () => {});

// expected: the reservation search "<button>" button is shown
Then('the reservation search {string} button is shown', async ({ findReservationDrawer }, button: string) => {
  await expect(findReservationDrawer.button(button), `the reservation search "${button}" button is not shown`).toBeVisible();
});

// expected: the reservation search "<button>" button is not shown
Then('the reservation search {string} button is not shown', async ({ findReservationDrawer }, button: string) => {
  await expect(findReservationDrawer.button(button), `the reservation search "${button}" button is shown`).toBeHidden();
});


// ---- The search hint (blank-reservation-search-hint) ----

// TestGraph decision node (the last step of the shared Background): each scenario below is one answer, nothing to do.
When('What is in the reservation search field?', async () => {});

// expected: the reservation search shows no message (no hint and no no-match line under the search form)
Then('the reservation search shows no message', async ({ findReservationDrawer }) => {
  await expect(findReservationDrawer.message, 'the reservation search shows a message').toBeHidden();
});
