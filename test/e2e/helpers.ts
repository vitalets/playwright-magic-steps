/* eslint-disable no-console */
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function runTests(dir: string) {
  const cwd = path.join(__dirname, dir);
  try {
    return await execPromise('npm test', { cwd });
  } catch (e) {
    const stdout = e.stdout?.toString().trim() || '';
    const stderr = e.stderr?.toString().trim() || '';
    console.log('STDOUT:', stdout);
    console.log('STDERR:', stderr);
    console.log('ERROR:', e.message);
    process.exit(1);
  }
}
