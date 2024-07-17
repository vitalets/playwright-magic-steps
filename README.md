# playwright-magic-steps

[![lint](https://github.com/vitalets/playwright-magic-steps/actions/workflows/lint.yaml/badge.svg)](https://github.com/vitalets/playwright-magic-steps/actions/workflows/lint.yaml)
[![test](https://github.com/vitalets/playwright-magic-steps/actions/workflows/test.yaml/badge.svg)](https://github.com/vitalets/playwright-magic-steps/actions/workflows/test.yaml)
[![npm version](https://img.shields.io/npm/v/playwright-magic-steps)](https://www.npmjs.com/package/playwright-magic-steps)
[![license](https://img.shields.io/npm/l/playwright-magic-steps)](https://github.com/vitalets/playwright-magic-steps/blob/main/LICENSE)

Auto-transform JavaScript comments into Playwright steps.

## Example
```ts
test('Check home page', async ({ page }) => {
  // step: Open home page
  await page.goto('https://playwright.dev');
  // step: Click "Get started" link
  await page.getByRole('link', { name: 'Get started' }).click();
  // step: Check page title
  await expect(page).toHaveTitle('Installation | Playwright');
});
```

Report:

![image](https://github.com/user-attachments/assets/70c38ae0-e451-468f-8678-71cc57a50ec1)

## Installation
Install from npm:
```
npm install -D playwright-magic-steps
```

## Usage
tbd

## Motivation
According to [Golden Rule](https://github.com/goldbergyoni/javascript-testing-best-practices?tab=readme-ov-file#section-0%EF%B8%8F⃣-the-golden-rule) of testing, I try to keep my Playwright tests flat and simple, to read them like a poem. Calls of `test.step()` add extra visual complexity and nesting. Moving step titles to comments makes test code clear and readable.

## Caveats

## Feedback
Feel free to share your feedback and suggestions in [issues](https://github.com/vitalets/playwright-magic-steps/issues).

## License
[MIT](https://github.com/vitalets/playwright-magic-steps/blob/main/LICENSE)