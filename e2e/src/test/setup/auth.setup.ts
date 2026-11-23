import { test as setup } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { LoginPage } from '@pages/LoginPage';

const authFile = '.auth/user.json';

// Runs once before the scenarios (project "setup") and saves the session for all of them.
setup('authenticate', async ({ page }) => {
  mkdirSync('.auth', { recursive: true });
  const user = process.env.QA_USER;
  const pass = process.env.QA_PASS;
  if (!user || !pass) {
    // App without login or without credentials: empty state so dependent projects still run.
    writeFileSync(authFile, JSON.stringify({ cookies: [], origins: [] }));
    return;
  }
  const login = new LoginPage(page);
  await login.goto();
  await login.login(user, pass);
  await login.expectLoggedIn();
  await page.context().storageState({ path: authFile });
});
