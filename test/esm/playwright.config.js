import { magicSteps } from '../../dist/index.js';
import { defineConfig } from '@playwright/test';

magicSteps({ enabled: true });

export default defineConfig({
  testDir: '.',
  reporter: './reporter',
});
