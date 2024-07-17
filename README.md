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

## Configuration
Add the following code to the Playwright config:
```ts
import { defineConfig } from '@playwright/test';
import { magicSteps } from 'playwright-magic-steps';

magicSteps();

export default defineConfig({
  ...
});
```

## Usage
You can define steps with special comments.

1. Step start is defined by `// step: {title}`
2. Step end is defined by one of the following rules:
   * indent is lower than step start
      ```ts
      test('my test', async () => {
        // step: Open home page
        await page.goto('https://playwright.dev');
      }); /* <- close step by indent */
      ```
  * explicit comment `// stepend` **on the same indent**:
      ```ts
      test('my test', async () => {
        // step: Open home page
        await page.goto('https://playwright.dev');
        // stepend /* <- close step by stepend */
      });
      ```
  * start of another step **on the same indent**:
        ```ts
      test('my test', async () => {
        // step: Open home page
        await page.goto('https://playwright.dev');
        // step: Click button /* <- close step by another step */
      });
      ```

> [!IMPORTANT]
> Code indentation is important! Consider using [Prettier](https://prettier.io/) or other auto-formatting tools.

## Motivation
According to [Golden Rule](https://github.com/goldbergyoni/javascript-testing-best-practices?tab=readme-ov-file#section-0%EF%B8%8F⃣-the-golden-rule) of testing, I try to keep my Playwright tests flat and simple. Wrapping code into `test.step()` adds extra visual complexity and nesting. Moving step titles to comments makes test code clean and more readable.

## Caveats

## Feedback
Feel free to share your feedback and suggestions in [issues](https://github.com/vitalets/playwright-magic-steps/issues).

## License
[MIT](https://github.com/vitalets/playwright-magic-steps/blob/main/LICENSE)