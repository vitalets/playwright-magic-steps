import { test } from 'vitest';
import { expectError } from './helpers';

test('step end without step start', () => {
  expectError([
    '  // stepend',
  ], 'Step end without step start');
});