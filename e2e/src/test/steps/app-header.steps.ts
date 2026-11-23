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

When('the user clicks the header {string} button', async ({ appHeader }, label: string) => {
  await appHeader.clickButton(label);
});

// ---- Reserve button and header layout (reserve-parts-manual-cases) ----

When('the user opens the reservation form', async ({ appHeader, reservePartsDrawer }) => {
  await appHeader.openReserve();
  await reservePartsDrawer.expectLoaded();
});

// The panel slides in for 0.3 s: on a small screen the layout is measured once it has settled.
When('the user opens the reservation form on the small screen', async ({ appHeader, reservePartsDrawer }) => {
  await appHeader.openReserve();
  await reservePartsDrawer.expectLoaded();
  await reservePartsDrawer.expectSettled();
});

When('the user looks at the page header', async ({ appHeader }) => {
  await appHeader.expectLoaded();
});

// expected[0]: the cart counter still shows "<count>"
Then('the cart counter still shows {string}', async ({ appHeader }, count: string) => {
  await expect(appHeader.cartCount, `the cart counter does not show "${count}"`).toHaveText(count);
});

// expected[0]: the "<label>" button shows its icon without the label and the header has no horizontal scroll
Then(
  'the {string} button shows its icon without the label and the header has no horizontal scroll',
  async ({ appHeader }, label: string) => {
    await expect(appHeader.buttonIcon(label), `the header "${label}" button does not show its icon`).toBeVisible();
    // a visually hidden label is clipped to 1x1 px
    await expect
      .poll(
        async () => {
          const size = await appHeader.buttonLabelSize(label);
          return size.width <= 1 && size.height <= 1;
        },
        { message: `the header "${label}" button still shows its label` },
      )
      .toBe(true);
    await expect
      .poll(async () => appHeader.horizontalOverflow(), { message: 'the header scrolls horizontally' })
      .toBeLessThanOrEqual(0);
  },
);

// expected[0]: a "<first>" button is displayed next to the "<second>" button
Then('a {string} button is displayed next to the {string} button', async ({ appHeader }, first: string, second: string) => {
  await expect(appHeader.button(first), `the header shows no "${first}" button`).toBeVisible();
  await expect(appHeader.button(second), `the header shows no "${second}" button`).toBeVisible();
  await expect
    .poll(async () => appHeader.buttonsSideBySide(first, second), {
      message: `the header "${first}" button is not right next to the "${second}" button`,
    })
    .toBe(true);
});
