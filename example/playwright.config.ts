import magicSteps from '../src'; // replace with: import 'playwright-magic-steps';
import { defineConfig } from '@playwright/test';

magicSteps({ enabled: true });

export default defineConfig({
  testDir: 'test',
  reporter: 'html',
});
