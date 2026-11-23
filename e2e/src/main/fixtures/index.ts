import { existsSync } from 'node:fs';
import type { APIRequestContext } from '@playwright/test';
import { test as base, createBdd } from 'playwright-bdd';
import { ScenarioContext } from '@support/ScenarioContext';
import { ApiLog } from '@support/ApiLog';
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/LoginPage';
import { AppHeader } from '@pages/AppHeader';
import { CartDrawer } from '@pages/CartDrawer';
import { ProductDetailView } from '@pages/ProductDetailView';

/**
 * Dependency injection, PicoContainer-style, with Playwright fixtures:
 * - Steps never `new` a page or an endpoint: they ask for it by name (`async ({ homePage, ctx }) => …`).
 * - Fixtures are scenario-scoped: created lazily on first use, shared by every step of that scenario, disposed after it.
 * - No shared state between scenarios → they run in parallel safely (fullyParallel + workers).
 * QACluster: codegen adds one fixture per Page Object, and one per endpoint class (`householdEndpoint`) when the
 * config allows API setup (`setup: "api-when-covered"`).
 */
type Fixtures = {
  ctx: ScenarioContext;
  /** HTTP client for endpoints/: API_BASE_URL (defaults to baseURL), API_TOKEN as Bearer, plus the UI session cookies. */
  api: APIRequestContext;
  apiLog: ApiLog;
  homePage: HomePage;
  loginPage: LoginPage;
  appHeader: AppHeader;
  cartDrawer: CartDrawer;
  productDetailView: ProductDetailView;
};

export const test = base.extend<Fixtures>({
  ctx: async ({}, use) => use(new ScenarioContext()),
  api: async ({ playwright, baseURL }, use) => {
    const token = process.env.API_TOKEN;
    const api = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL || baseURL,
      extraHTTPHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
      storageState: existsSync('.auth/user.json') ? '.auth/user.json' : undefined,
    });
    await use(api);
    await api.dispose();
  },
  apiLog: async ({}, use, testInfo) => {
    const log = new ApiLog();
    await use(log);
    await log.attach(testInfo);
  },
  homePage: async ({ page }, use) => use(new HomePage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  appHeader: async ({ page }, use) => use(new AppHeader(page)),
  cartDrawer: async ({ page }, use) => use(new CartDrawer(page)),
  productDetailView: async ({ page }, use) => use(new ProductDetailView(page)),
  // Endpoint fixtures look like: householdEndpoint: async ({ api, apiLog }, use) => use(new HouseholdEndpoint(api, apiLog)),
});

export const { Given, When, Then, Before, After } = createBdd(test);
