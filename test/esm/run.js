/**
 * Run test for esm.
 * NODE_OPTIONS="--import ../../dist/esm/index.js" npx playwright test
 */
/* eslint-disable no-console */
import { exec } from 'node:child_process';
import assert from 'node:assert/strict';
import { promisify } from 'util';
const execPromise = promisify(exec);

// todo: hangs. investigate!
test();

async function test() {
  const { stdout } = await runTests();
  assert.match(stdout, /Open home page/);
  assert.match(stdout, /Click 'Get started' link/);
  assert.match(stdout, /Check page title/);
}

async function runTests() {
  try {
    return await execPromise('npx playwright test', {
      cwd: import.meta.dirname,
      stdio: 'pipe',
      env: {
        ...process.env,
        NODE_OPTIONS: '--import ../../dist/esm/index.js',
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
