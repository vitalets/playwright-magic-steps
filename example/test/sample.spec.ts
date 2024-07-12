import { test, expect } from '@playwright/test';

test('Check home page', async ({ page }) => {
  // step: open home page
  await page.goto('https://playwright.dev');
  // step: click "Get started" link
  await page.getByRole('link', { name: 'Get started' }).click();
  // step: check page title
  await expect(page).toHaveTitle('Installation | Playwright');
});


