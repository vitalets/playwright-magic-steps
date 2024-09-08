# playwright-magic-steps

[![lint](https://github.com/vitalets/playwright-magic-steps/actions/workflows/lint.yaml/badge.svg)](https://github.com/vitalets/playwright-magic-steps/actions/workflows/lint.yaml)
[![test](https://github.com/vitalets/playwright-magic-steps/actions/workflows/test.yaml/badge.svg)](https://github.com/vitalets/playwright-magic-steps/actions/workflows/test.yaml)
[![npm version](https://img.shields.io/npm/v/playwright-magic-steps)](https://www.npmjs.com/package/playwright-magic-steps)
[![license](https://img.shields.io/npm/l/playwright-magic-steps)](https://github.com/vitalets/playwright-magic-steps/blob/main/LICENSE)

Auto-transform JavaScript comments into [Playwright](https://playwright.dev/) steps.

<!-- toc -->

- [Example](#example)
- [Installation](#installation)
- [Activation](#activation)
  * [CommonJS](#commonjs)
  * [ESM](#esm)
- [Usage](#usage)
  * [Step start](#step-start)
  * [Step end](#step-end)
  * [Nested steps](#nested-steps)
- [Motivation](#motivation)
- [Caveats](#caveats)
- [Changelog](#changelog)
  * [0.4.0](#040)
- [License](#license)

<!-- tocstop -->

## Example
Test code:
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

Test code actually executed:
```ts
test('Check home page', async ({ page }) => {
  await test.step('Open home page', async () => {
    await page.goto('https://playwright.dev');
  });
  await test.step('Click "Get started" link', async () => {
    await page.getByRole('link', { name: 'Get started' }).click();
  });
  await test.step('Check page title', async () => {
    await expect(page).toHaveTitle('Installation | Playwright');
  });
});
```

## Installation
Install from npm:
```
npm install -D playwright-magic-steps
```

## Activation
To enable magic steps transformation, you'll need to run Playwright with a pre-required module. You can include this module using the `NODE_OPTIONS` environment variable. The exact value will depend on whether your project uses CommonJS or ESM.

### CommonJS
Run Playwright with the following `-r` flag in `NODE_OPTIONS`:
```
npx cross-env NODE_OPTIONS="-r playwright-magic-steps" playwright test
```

<details>
  <summary>[LEGACY WAY] use Playwright config</summary>
  Does not work since Playwright 1.47.

  ```ts
  import 'playwright-magic-steps'; // <- enables magic steps
  import { defineConfig } from '@playwright/test';

  export default defineConfig({
    ...
  });
  ```
</details>

### ESM
Run Playwright with the following `--import` flag in `NODE_OPTIONS`:
```
npx cross-env NODE_OPTIONS="--import playwright-magic-steps/esm" playwright test
```

## Usage
You can define steps with special comments.

### Step start
Step start is defined by the comment: 
```js
// step: {title}
```

### Step end
Step end is defined by the one of the following rules (indent matters):

* start of another step with the same indent:
  ```ts
  test('my test', async () => {
    // step: Open home page
    await page.goto('/');
    // step: Click button
  });
  ```

* explicit comment `// stepend` with the same indent:
  ```ts
  test('my test', async () => {
    // step: Open home page
    await page.goto('/');
    // stepend
  });
  ```

* line indent is lower than indent of step start:
  ```ts
  test('my test', async () => {
    // step: Open home page
    await page.goto('/');
  });
  ```

### Nested steps
Steps can be nested:
```ts
test('my test', async () => {
  // step: Open home page
  await page.goto('/');
  if (noAuth) {
    // step: Perform auth
    await page.goto('/login');
  }
});
```

> [!IMPORTANT]
> Code **indentation** is important! Consider using [Prettier](https://prettier.io/) or other auto-formatting tools.

## Motivation
According to [Golden Rule](https://github.com/goldbergyoni/javascript-testing-best-practices?tab=readme-ov-file#section-0%EF%B8%8F⃣-the-golden-rule) of testing, I try to keep my Playwright tests flat and simple. Wrapping code into `test.step()` adds extra visual complexity and nesting. Creating steps by comments makes test code more readable.

## Caveats
This library performs string replacements in your code and can potentially break it. This is a price we pay for convenience.

If something gets broken, you can always opt-out magic steps. Your tests will run, because all instructions are plain JavaScript comments. Feel free to report any problems in [issues](https://github.com/vitalets/playwright-magic-steps/issues).

Example of broken code:
```ts
test('Check home page', async ({ page }) => {
  // step: Open home page
  await page.goto('https://playwright.dev');
  const link = page.getByRole('link', { name: 'Get started' });

  // step: Click link
  await link.click();
});
```

Error:
```
ReferenceError: link is not defined
```
There is an error, because in the transformed code `link` variable is wrapped into the scope of the first step and not accessible in the second step:
```ts
test('Check home page', async ({ page }) => {
  await test.step('Open home page', async () => {
    await page.goto('https://playwright.dev');
    const link = page.getByRole('link', { name: 'Get started' });
  });

  await test.step('Click link', async () => {
    await link.click();
  }); 
});
```

How to fix:

* Move `link` variable to the second step (that is more logical):
  ```ts
  test('Check home page', async ({ page }) => {
    // step: Open home page
    await page.goto('https://playwright.dev');

    // step: Click link
    const link = page.getByRole('link', { name: 'Get started' });
    await link.click();
  });
  ```

* Close first step earlier (if link variable is shared between several steps):
  ```ts
  test('Check home page', async ({ page }) => {
    // step: Open home page
    await page.goto('https://playwright.dev');
    // stepend

    const link = page.getByRole('link', { name: 'Get started' });

    // step: Click link
    await link.click();
  });  
  ```

## Changelog

### 0.4.0
* dropped support of magic steps activation via `playwright.config.js` as it does not work in Playwright 1.47

## License
[MIT](https://github.com/vitalets/playwright-magic-steps/blob/main/LICENSE)