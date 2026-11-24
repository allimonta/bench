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
