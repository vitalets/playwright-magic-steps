import 'playwright-magic-steps';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  reporter: './reporter',
});
