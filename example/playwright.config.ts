import '../src'; // replace with: import 'playwright-magic-steps';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'test',
  reporter: 'html',
});
