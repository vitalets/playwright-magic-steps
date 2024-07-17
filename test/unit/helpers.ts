import { expect } from 'vitest';
import { transformMagicSteps } from '../../src/steps';

export function expectSteps(actual: string[], expected: string[]) {
  expect(transformMagicSteps(actual.join('\n'))).toEqual(expected.join('\n'));
}

export function expectError(actual: string[], error: string) {
  expect(() => transformMagicSteps(actual.join('\n'))).toThrow(error);
}

export function expectErrorStack(actual: string[], error: string) {
  try {
    transformMagicSteps(actual.join('\n'), 'test.js');
  } catch (e) {
    expect(e.stack).toContain(error);
    return;
  }
  expect.fail('Expect error!');
}
