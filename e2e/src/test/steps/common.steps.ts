import { Given } from '@fixtures';

// Navigation steps shared by every feature. Keep step text in the language of the Gherkin coming from TestGraph.
Given('I open the home page', async ({ homePage }) => {
  await homePage.goto();
});
