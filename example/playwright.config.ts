import { defineConfig } from '@playwright/test';
import 'playwright-magic-steps';

export default defineConfig({
  testDir: '.',
  reporter: 'html',
});
