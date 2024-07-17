import { test } from 'vitest';
import { expectSteps } from './helpers';

test('close step by another step', () => {
  expectSteps(
    [
      '  // step: step 1',
      '  await page.reload();',
      '  // step: step 2',
      '  await page.reload();',
      '',
    ],
    [
      '  await test.step(`step 1`, async () => {',
      '  await page.reload(); });',
      '  await test.step(`step 2`, async () => {',
      '  await page.reload(); });',
      '',
    ],
  );
});

test('close step by comment', () => {
  expectSteps(
    ['  // step: step 1', '  await page.reload();', '  // stepend'],
    [
      '  await test.step(`step 1`, async () => {',
      '  await page.reload();',
      '  });',
    ],
  );
});

test('close step by indent (append)', () => {
  expectSteps([
      'function foo() {', 
      '  // step: step 1', 
      '  await page.reload();', 
      '}'
    ], [
      'function foo() {',
      '  await test.step(`step 1`, async () => {',
      '  await page.reload(); });',
      '}',
    ],
  );
});

test('close step by indent (prepend)', () => {
  expectSteps(
    [
      '  // step: step 1',
      '  await page.reload();',
      '  // await page.goto();',
      '',
    ],
    [
      '  await test.step(`step 1`, async () => {',
      '  await page.reload();',
      '  }); // await page.goto();',
      '',
    ],
  );
});

test('close step by indent with "//"', () => {
  expectSteps(
    [
      '  // step: step 1',
      '  await page.reload();',
      '  await page.locator("xpath=//button").click();',
      '',
    ],
    [
      '  await test.step(`step 1`, async () => {',
      '  await page.reload();',
      '  await page.locator("xpath=//button").click(); });',
      '',
    ],
  );
});

test('close several steps by indent (different lines)', () => {
  expectSteps(
    [
      '  // step: step 1',
      '  await page.reload();',
      '  if (noAuth) {',
      '    // step: step 2',
      '    await page.reload();',
      '  }',
      '',
    ],
    [
      '  await test.step(`step 1`, async () => {',
      '  await page.reload();',
      '  if (noAuth) {',
      '    await test.step(`step 2`, async () => {',
      '    await page.reload(); });',
      '  } });',
      '',
    ],
  );
});

test('close several steps by indent (same line)', () => {
  expectSteps(
    [
      '  // step: step 1',
      '  await page.reload();',
      '  if (noAuth) ',
      '    // step: step 2',
      '    await page.close();',
      '',
    ],
    [
      '  await test.step(`step 1`, async () => {',
      '  await page.reload();',
      '  if (noAuth) ',
      '    await test.step(`step 2`, async () => {',
      '    await page.close(); }); });',
      '',
    ],
  );
});

test('close several steps by file end', () => {
  expectSteps(
    [
      '  // step: step 1',
      '  await page.reload();',
      '  if (noAuth) ',
      '    // step: step 2',
      '    await page.close();',
    ],
    [
      '  await test.step(`step 1`, async () => {',
      '  await page.reload();',
      '  if (noAuth) ',
      '    await test.step(`step 2`, async () => {',
      '    await page.close(); }); });',
    ],
  );
});

test('close several steps by indent + comment', () => {
  expectSteps(
    [
      '  // step: step 1',
      '  await page.reload();',
      '  if (noAuth)',
      '    // step: step 2',
      '    await page.reload();',
      '  // endstep',
    ],
    [
      '  await test.step(`step 1`, async () => {',
      '  await page.reload();',
      '  if (noAuth)',
      '    await test.step(`step 2`, async () => {',
      '    await page.reload(); });',
      '  });',
    ],
  );
});

test('close several steps by another step', () => {
  expectSteps(
    [
      '  // step: step 1',
      '  await page.reload();',
      '  if (noAuth)',
      '    // step: step 2',
      '    await page.reload();',
      '  // step: step 3',
    ],
    [
      '  await test.step(`step 1`, async () => {',
      '  await page.reload();',
      '  if (noAuth)',
      '    await test.step(`step 2`, async () => {',
      '    await page.reload(); }); });',
      '  await test.step(`step 3`, async () => { });',
    ],
  );
});
