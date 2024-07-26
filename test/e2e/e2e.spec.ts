import { test, expect } from 'vitest';
import { runTests } from './helpers';

test('cjs (-r option)', async () => {
  const { stdout } = await runTests('cjs');
  expectSteps(stdout);
});

test('cjs (import in config)', async () => {
  const { stdout } = await runTests('cjs', 'npm run test:import');
  expectSteps(stdout);
});

test('esm (--import option)', async () => {
  const { stdout } = await runTests('esm');
  expectSteps(stdout);
});

test('esm-ts (--import option)', async () => {
  const { stdout } = await runTests('esm-ts');
  expectSteps(stdout);
});

function expectSteps(stdout: string) {
  expect(stdout).toContain('Open home page');
  expect(stdout).toContain("Click 'Get started' link");
  expect(stdout).toContain('Check page title');
  expect(stdout).toContain('helper step');
}
