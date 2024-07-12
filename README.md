# playwright-magic-steps
Auto-transform JavaScript comments into Playwright steps.

## Example
```ts
test('Check home page', async ({ page }) => {
  // step: open home page
  await page.goto('https://playwright.dev');
  // step: click "Get started" link
  await page.getByRole('link', { name: 'Get started' }).click();
  // step: check page title
  await expect(page).toHaveTitle('Installation | Playwright');
});
```
Report:
tbd

## Installation

## Usage

## Motivation

## Caveats

## Feedback
Feel free to share your feedback and suggestions in [issues](https://github.com/vitalets/playwright-magic-steps/issues).

## License
[MIT](https://github.com/vitalets/playwright-magic-steps/blob/main/LICENSE)