import { magicSteps } from 'playwright-magic-steps';
import { defineConfig } from '@playwright/test';

magicSteps({ enabled: true });

export default defineConfig({
  testDir: '.',
  reporter: './reporter',
});
