import { expect } from 'vitest';
import { transformMagicSteps } from '../src';

export function expectSteps(actual: string[], expected: string[]) {
  expect(transformMagicSteps(actual.join('\n'))).toEqual(expected.join('\n'));
}
