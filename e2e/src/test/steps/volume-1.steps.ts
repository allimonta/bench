import { expect } from '@playwright/test';
import { When, Then } from '@fixtures';
import type { HomePage } from '@pages/HomePage';
import type { AppHeader } from '@pages/AppHeader';
import type { CartDrawer } from '@pages/CartDrawer';
import type { ScenarioContext } from '@support/ScenarioContext';
import { anyCategory, products } from '@data/products';
import { formatUsd } from '@utils/money';

// Steps of the shop's screens: the Shop section (product grid, filters) and the cart pop-up.
// The cart lives in the browser's localStorage: every scenario gets a fresh browser context, so it starts with an empty
// cart and what it adds disappears with its context (nothing to clean up).

/** Opens the shop and adds each product once, in order; keeps what was added in `cartProducts`. */
const addToCart = async (homePage: HomePage, ctx: ScenarioContext, ids: string[]): Promise<void> => {
  await homePage.goto();
  const added = [];
  for (const id of ids) {
    added.push(await homePage.productInfo(id));
    await homePage.addToCart(id);
  }
  ctx.set('cartProducts', added);
};

/** Puts a product in the cart, opens the cart and checks its checkout form is there (the scenario cannot go on without it). */
const openCheckoutForm = async (homePage: HomePage, appHeader: AppHeader, cartDrawer: CartDrawer, ctx: ScenarioContext) => {
  await addToCart(homePage, ctx, [products.any]);
  await appHeader.openCart();
  await cartDrawer.expectLoaded();
  await expect(cartDrawer.checkoutForm, 'the cart shows no checkout form').toBeVisible();
};

const firstCartProduct = (ctx: ScenarioContext) => ctx.get('cartProducts')[0];

// ---- Shop section ----

When('the user opens the Android parts shop page', async ({ homePage }) => {
  await homePage.goto();
});

When('the user is on the home section of the page', async ({ homePage }) => {
  await homePage.goto();
});

When('the user is on the Shop section', async ({ homePage }) => {
  await homePage.openShopSection();
});

When('the user has applied a category filter', async ({ homePage, ctx }) => {
  await homePage.goto();
  ctx.set('productCountBefore', await homePage.productCards.count());
  await homePage.filterByCategory(anyCategory);
});

When('the user clicks {string}', async ({ homePage }, button: string) => {
  await homePage.clickButton(button);
});

When('the user selects the {string} category filter', async ({ homePage }, category: string) => {
  await homePage.filterByCategory(category);
});

When('the user sorts products by {string}', async ({ homePage }, option: string) => {
  await homePage.sortBy(option);
});

When('the user searches for {string}', async ({ homePage }, term: string) => {
  await homePage.search(term);
});

When('the user clicks {string} on a product', async ({ homePage, appHeader, ctx }, button: string) => {
  ctx.set('cartCountBefore', await appHeader.cartCountValue());
  const product = await homePage.productInfo(products.any);
  ctx.set('cartProducts', [product]);
  await homePage.clickProductButton(product.id, button);
});

When('the user clicks {string} on the same product again', async ({ homePage, ctx }, button: string) => {
  await homePage.clickProductButton(firstCartProduct(ctx).id, button);
});

When('the user clicks on a product name', async ({ homePage, ctx }) => {
  const product = await homePage.productInfo(products.any);
  ctx.set('viewedProduct', product);
  await homePage.openProductDetails(product.id);
});

When('a product is marked as {string}', async ({ homePage, ctx }, status: string) => {
  await homePage.goto();
  await expect(homePage.productsWithStatus(status), `no product is marked as "${status}"`).not.toHaveCount(0);
  ctx.set('stockStatus', status);
});

When('the user views that product', async ({ homePage, ctx }) => {
  await homePage.viewProductWithStatus(ctx.get('stockStatus'));
});

When('the user reloads the page', async ({ homePage }) => {
  await homePage.reload();
});

// expected[0]: all products are displayed again
Then('all products are displayed again', async ({ homePage, ctx }) => {
  await expect(homePage.productCards, 'the shop does not list all its products again').toHaveCount(
    ctx.get('productCountBefore'),
  );
});

// expected[0]: a list of products is displayed with name, image and price
Then('a list of products is displayed with name, image and price', async ({ homePage }) => {
  await expect(homePage.productCards, 'the shop lists no products').not.toHaveCount(0);
  const listed = await homePage.productCards.count();
  await expect(homePage.productNames, 'not every product shows its name').toHaveCount(listed);
  await expect(homePage.productImages, 'not every product shows its image').toHaveCount(listed);
  await expect(homePage.productPrices, 'not every product shows its price').toHaveCount(listed);
});

// expected[0]: products are displayed in ascending price order
Then('products are displayed in ascending price order', async ({ homePage }) => {
  const prices = await homePage.priceValues();
  expect(prices, 'the products are not in ascending price order').toEqual([...prices].sort((a, b) => a - b));
});

// expected[0]: only products from the "Screens" category are displayed
Then('only products from the {string} category are displayed', async ({ homePage }, category: string) => {
  await expect(homePage.productsInCategory(category), `no product of the "${category}" category is listed`).not.toHaveCount(0);
  await expect(homePage.productsOutsideCategory(category), `products of other categories than "${category}" are listed`).toHaveCount(0);
});

// expected[0]: a "no products found" message is displayed
Then('a {string} message is displayed', async ({ homePage }, message: string) => {
  await expect(homePage.message(message), `the shop does not show the "${message}" message`).toBeVisible();
});

// expected[0]: only products matching "battery" are displayed
Then('only products matching {string} are displayed', async ({ homePage }, term: string) => {
  await expect(homePage.productCards, `no product matching "${term}" is listed`).not.toHaveCount(0);
  await expect
    .poll(async () => (await homePage.productTexts()).filter((text) => !text.toLowerCase().includes(term.toLowerCase())), {
      message: `products that do not match "${term}" are listed`,
    })
    .toEqual([]);
});

// expected[0]: the "Add to cart" button is disabled
Then('the {string} button is disabled', async ({ homePage, ctx }, button: string) => {
  const status = ctx.get('stockStatus');
  await expect(homePage.productWithStatusButton(status, button), `the "${button}" button of the "${status}" product is enabled`).toBeDisabled();
});

// expected[0]: the product detail view shows description, price and compatibility info
Then('the product detail view shows description, price and compatibility info', async ({ productDetailView, ctx }) => {
  const product = ctx.get('viewedProduct');
  await expect(productDetailView.text(product.name, product.description), 'the product detail view shows no description').toBeVisible();
  await expect(productDetailView.text(product.name, formatUsd(product.price)), 'the product detail view shows no price').toBeVisible();
  await expect(productDetailView.compatibilityInfo(product.name), 'the product detail view shows no compatibility info').toBeVisible();
});

// expected[0]: the page scrolls to the Shop section and the URL ends with "#shop"
Then('the page scrolls to the Shop section and the URL ends with {string}', async ({ homePage, page }, ending: string) => {
  await expect(homePage.shopSection, 'the page did not scroll to the Shop section').toBeInViewport();
  await expect(page, `the URL does not end with "${ending}"`).toHaveURL(new RegExp(`${ending.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
});

// ---- Cart ----

When('the user has added two different products to the cart', async ({ homePage, ctx }) => {
  await addToCart(homePage, ctx, [products.any, products.another]);
});

When('the user has products in the cart', async ({ homePage, ctx }) => {
  await addToCart(homePage, ctx, [products.any, products.another]);
});

When('the user has one product in the cart', async ({ homePage, ctx }) => {
  await addToCart(homePage, ctx, [products.any]);
});

When('the user has a product in the cart', async ({ homePage, ctx }) => {
  await addToCart(homePage, ctx, [products.any]);
});

When('the user has added a product to the cart', async ({ homePage, ctx }) => {
  await addToCart(homePage, ctx, [products.any]);
});

When('the user has a product in the cart with quantity {int}', async ({ homePage, ctx }, quantity: number) => {
  await addToCart(homePage, ctx, Array.from({ length: quantity }, () => products.any));
  ctx.set('cartProducts', ctx.get('cartProducts').slice(0, 1));
});

When("the user's cart is empty", async ({ homePage, appHeader }) => {
  await homePage.goto();
  await expect(appHeader.cartCount, 'the cart is not empty').toHaveText('0');
});

When('the user is on the checkout form', async ({ homePage, appHeader, cartDrawer, ctx }) => {
  await openCheckoutForm(homePage, appHeader, cartDrawer, ctx);
});

When('the user has a product in the cart and is on the checkout form', async ({ homePage, appHeader, cartDrawer, ctx }) => {
  await openCheckoutForm(homePage, appHeader, cartDrawer, ctx);
});

When('the user enters {string} in the email field and submits', async ({ cartDrawer }, email: string) => {
  await cartDrawer.enterEmailAndSubmit(email);
});

When('the user submits the form with empty required fields', async ({ cartDrawer }) => {
  await cartDrawer.submitCheckoutForm();
});

When('the user removes the product from the cart', async ({ appHeader, cartDrawer, ctx }) => {
  await appHeader.openCart();
  await cartDrawer.expectLoaded();
  await cartDrawer.removeProduct(firstCartProduct(ctx).id);
});

When('the user changes the quantity to {int}', async ({ appHeader, cartDrawer, ctx }, quantity: number) => {
  await appHeader.openCart();
  await cartDrawer.expectLoaded();
  await cartDrawer.setQuantity(firstCartProduct(ctx), quantity);
});

When('the user tries to set the quantity to {int}', async ({ appHeader, cartDrawer, ctx }, quantity: number) => {
  await appHeader.openCart();
  await cartDrawer.expectLoaded();
  await cartDrawer.setQuantity(firstCartProduct(ctx), quantity);
});

When('the user attempts to proceed to checkout', async ({ appHeader, cartDrawer }) => {
  // The cart is the way to checkout: it is where "Place order" is.
  await appHeader.openCart();
  await cartDrawer.expectLoaded();
});

When('the user applies the discount code {string}', async ({ appHeader, cartDrawer, ctx }, code: string) => {
  await appHeader.openCart();
  await cartDrawer.expectLoaded();
  ctx.set('cartTotalBefore', await cartDrawer.totalAmount());
  await cartDrawer.applyDiscountCode(code);
});

// expected[0]: an "invalid email" error message is displayed
Then('an {string} error message is displayed', async ({ cartDrawer }, message: string) => {
  await expect(cartDrawer.formMessage(message), `the checkout form does not show the "${message}" error message`).toBeVisible();
});

// expected[0]: the total equals the sum of both product prices
Then('the total equals the sum of both product prices', async ({ cartDrawer, ctx }) => {
  const sum = ctx.get('cartProducts').reduce((total, product) => total + product.price, 0);
  await expect(cartDrawer.total, `the cart total is not the sum of the product prices (${formatUsd(sum)})`).toHaveText(formatUsd(sum));
});

// expected[0]: the cart is empty and the counter shows 0
Then('the cart is empty and the counter shows {int}', async ({ cartDrawer, appHeader }, counter: number) => {
  await expect(cartDrawer.emptyMessage, 'the cart is not empty').toBeVisible();
  await expect(appHeader.cartCount, `the cart counter does not show ${counter}`).toHaveText(String(counter));
});

// expected[0]: the line subtotal updates to 3 times the unit price
Then('the line subtotal updates to {int} times the unit price', async ({ cartDrawer, ctx }, times: number) => {
  const product = firstCartProduct(ctx);
  await expect(cartDrawer.lineTotal(product.id), `the line subtotal is not ${times} times ${formatUsd(product.price)}`).toHaveText(
    formatUsd(times * product.price),
  );
});

// expected[0]: the checkout is not allowed and an empty-cart message is shown
Then('the checkout is not allowed and an empty-cart message is shown', async ({ cartDrawer }) => {
  await expect(cartDrawer.placeOrderButton, 'the empty cart still offers "Place order"').toBeHidden();
  await expect(cartDrawer.emptyMessage, 'the cart shows no empty-cart message').toBeVisible();
});

// expected[0]: the cart shows that product with quantity 2
Then('the cart shows that product with quantity {int}', async ({ appHeader, cartDrawer, ctx }, quantity: number) => {
  const product = firstCartProduct(ctx);
  await appHeader.openCart();
  await expect(cartDrawer.quantity(product.id), `the cart does not show "${product.name}" with quantity ${quantity}`).toHaveText(
    String(quantity),
  );
});

// expected[0]: the quantity remains at 1 or the product is removed with a confirmation
Then('the quantity remains at {int} or the product is removed with a confirmation', async ({ cartDrawer, ctx }, quantity: number) => {
  const product = firstCartProduct(ctx);
  await expect(
    cartDrawer.quantityOrRemovalConfirmation(product.id, quantity),
    `"${product.name}" neither stays at quantity ${quantity} nor asks a confirmation before its removal`,
  ).toBeVisible();
});

// expected[0]: the product is still in the cart
Then('the product is still in the cart', async ({ appHeader, cartDrawer, ctx }) => {
  const product = firstCartProduct(ctx);
  await appHeader.openCart();
  await expect(cartDrawer.lineItem(product.id), `"${product.name}" is no longer in the cart`).toBeVisible();
});

// expected[0]: an "invalid code" message is displayed and the total remains unchanged
Then('an {string} message is displayed and the total remains unchanged', async ({ cartDrawer, ctx }, message: string) => {
  const before = formatUsd(ctx.get('cartTotalBefore'));
  await expect(cartDrawer.message(message), `the cart does not show the "${message}" message`).toBeVisible();
  await expect(cartDrawer.total, `the cart total changed from ${before}`).toHaveText(before);
});

// expected[0]: the total is reduced by 10 percent
Then('the total is reduced by {int} percent', async ({ cartDrawer, ctx }, percent: number) => {
  const before = ctx.get('cartTotalBefore');
  const reduced = formatUsd(Math.round((before * (100 - percent)) / 100));
  await expect(cartDrawer.total, `the cart total ${formatUsd(before)} was not reduced by ${percent}% to ${reduced}`).toHaveText(reduced);
});

// expected[0]: an error message is displayed for each missing field
Then('an error message is displayed for each missing field', async ({ cartDrawer }) => {
  const required = await cartDrawer.requiredFields.count();
  await expect(cartDrawer.fieldErrors, `the checkout form does not show one error for each of its ${required} required fields`).toHaveCount(
    required,
  );
});

// ---- Shop page (reserve-parts-manual-cases) ----

When('the user is on the Partwerk shop page', async ({ homePage }) => {
  await homePage.goto();
});

When('the user opens the page on a {int}px wide viewport', async ({ homePage }, width: number) => {
  await homePage.openOnViewport(width);
});
