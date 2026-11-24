import { expect } from '@playwright/test';
import { When, Then } from '@fixtures';

// Steps written by hand for find-a-reservation-local.feature (framework only, not in TestGraph).

When('the user presses Escape in the reservation search', async ({ page, findReservationDrawer }) => {
  await findReservationDrawer.expectLoaded();
  await page.keyboard.press('Escape');
});

Then('the reservation search is closed', async ({ findReservationDrawer }) => {
  await expect(findReservationDrawer.panel, 'the reservation search is still open').toHaveAttribute('aria-hidden', 'true');
});

Then('the keyboard focus is on the header {string} button', async ({ appHeader }, label: string) => {
  await expect(appHeader.button(label), `the focus is not on the header "${label}" button`).toBeFocused();
});
