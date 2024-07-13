import { test } from 'vitest';
import { expectSteps } from './helpers';

test('step by another step', () => {
  expectSteps([
    '  // step: step 1',
    '  await page.reload();',
    '  // step: step 2',
    '  await page.reload();',
    '',
  ], [
    '  await test.step(`step 1`, async () => {',
    '  await page.reload(); });',
    '  await test.step(`step 2`, async () => {',
    '  await page.reload(); });',
    '',
  ]);
});

test('step by stepend directive', () => {
  expectSteps([
    '  // step: step 1', 
    '  await page.reload();', 
    '  // stepend'
  ], [
    '  await test.step(`step 1`, async () => {', 
    '  await page.reload(); });',
    '',
  ]);
});

test('step by indent', () => {
  expectSteps([
    'function foo() {',
    '  // step: step 1',
    '  await page.reload();',
    '}',
  ], [
    'function foo() {',
    '  await test.step(`step 1`, async () => {',
    '  await page.reload(); });',
    '}',
  ]);
});

test('nested steps', () => {
  expectSteps([
    '  // step: step 1',
    '  await page.reload();',
    '  function foo() {',
    '    // step: step 2',
    '    await page.reload();',
    '  }',
    '',
  ], [
    '  await test.step(`step 1`, async () => {',
    '  await page.reload();',
    '  function foo() {',
    '    await test.step(`step 2`, async () => {',
    '    await page.reload(); });',
    '  } });',
    '',
  ]);
});

