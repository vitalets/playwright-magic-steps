/**
 * Run test for cjs.
 */
/* eslint-disable no-console */
const { exec } = require('node:child_process');
const assert = require('node:assert/strict');
const { promisify } = require('util');
const execPromise = promisify(exec);

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
      cwd: __dirname,
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
