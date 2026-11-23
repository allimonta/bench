import { expect } from '@playwright/test';
import { When, Then } from '@fixtures';

// Steps of the site header (on every screen): the navigation menu and the cart button with its counter.

When('the user opens the cart', async ({ appHeader, cartDrawer }) => {
  await appHeader.openCart();
  await cartDrawer.expectLoaded();
});

When('the user navigates to the {string} section', async ({ appHeader }, section: string) => {
  await appHeader.clickNavLink(section);
});

When('the user clicks the {string} link in the navigation menu', async ({ appHeader }, link: string) => {
  await appHeader.clickNavLink(link);
});

// expected[0]: the cart counter increases by 1
Then('the cart counter increases by {int}', async ({ appHeader, ctx }, increase: number) => {
  const before = ctx.get('cartCountBefore');
  await expect(appHeader.cartCount, `the cart counter did not go from ${before} to ${before + increase}`).toHaveText(
    String(before + increase),
  );
});
