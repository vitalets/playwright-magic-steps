import { test, expect } from '@playwright/test';

test('Check home page', async ({ page }) => {
  // step: Open home page
  await page.goto('https://playwright.dev');
  // step: Click 'Get started' link
  await page.getByRole('link', { name: 'Get started' }).click();
  // step: Check page title
  await expect(page).toHaveTitle('Installation | Playwright');
});
