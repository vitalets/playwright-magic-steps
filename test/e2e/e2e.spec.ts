import { test, expect } from 'vitest';
import { runTests } from './helpers';

test('cjs', async () => {
  const { stdout } = await runTests('cjs');
  expectSteps(stdout);
});

test('cjs-ts', async () => {
  const { stdout } = await runTests('cjs-ts');
  expectSteps(stdout);
});

test('esm', async () => {
  const { stdout } = await runTests('esm');
  expectSteps(stdout);
});

test('esm-ts', async () => {
  const { stdout } = await runTests('esm-ts');
  expectSteps(stdout);
});

function expectSteps(stdout: string) {
  expect(stdout).toContain('Open home page');
  expect(stdout).toContain("Click 'Get started' link");
  expect(stdout).toContain('Check page title');
  expect(stdout).toContain('helper step');
}
