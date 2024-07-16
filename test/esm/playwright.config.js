import magicSteps from '../../dist/index.js';
import { defineConfig } from '@playwright/test';

magicSteps.default({ enabled: true });

export default defineConfig({
  testDir: '.',
  reporter: './reporter',
});
