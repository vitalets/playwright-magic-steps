/**
 * Run test for esm.
 * NODE_OPTIONS="--import playwright-magic-steps/esm" npx playwright test
 */
/* eslint-disable no-console */
import { exec } from 'node:child_process';
import assert from 'node:assert/strict';
import { promisify } from 'util';
const execPromise = promisify(exec);

test();

async function test() {
  const { stdout } = await runTests();
  assert.match(stdout, /Open home page/);
  assert.match(stdout, /Click 'Get started' link/);
  assert.match(stdout, /Check page title/);
  console.log('esm: ok');
}

async function runTests() {
  try {
    return await execPromise('npx playwright test', {
      cwd: import.meta.dirname,
      stdio: 'pipe',
      env: {
        ...process.env,
        NODE_OPTIONS: '--import playwright-magic-steps/esm',
      },
    });
  } catch (e) {
    const stdout = e.stdout?.toString().trim() || '';
    const stderr = e.stderr?.toString().trim() || '';
    console.log('STDOUT:', stdout);
    console.log('STDERR:', stderr);
    console.log('ERROR:', e.message);
    process.exit(1);
  }
}
