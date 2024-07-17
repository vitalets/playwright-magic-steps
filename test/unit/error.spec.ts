import { test } from 'vitest';
import { expectError } from './helpers';

test('step end without step start', () => {
  expectError([
    '  // stepend'
  ], 'Step end without step start');
});

test('step end with less indent', () => {
  expectError([
    '  // step: step 1', 
    '  await page.reload();', 
    '// stepend'
  ], 'Step end without step start');
});

test('step end with more indent', () => {
  expectError([
    '  // step: step 1', 
    '  await page.reload();', 
    '    // stepend'
  ], 'Step end without step start');
});
