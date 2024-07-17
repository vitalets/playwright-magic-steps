import { test, expect } from 'vitest';
import { runTests } from './helpers';

test('cjs', async () => {
  const { stdout } = await runTests('cjs');
  expect(stdout).toContain('Open home page');
  expect(stdout).toContain("Click 'Get started' link");
  expect(stdout).toContain('Check page title');
});

test('esm', async () => {
  const { stdout } = await runTests('esm');
  expect(stdout).toContain('Open home page');
  expect(stdout).toContain("Click 'Get started' link");
  expect(stdout).toContain('Check page title');
});
