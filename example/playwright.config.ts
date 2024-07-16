// replace with:
// import { magicSteps } from 'playwright-magic-steps';
import { magicSteps } from '../src';
import { defineConfig } from '@playwright/test';

magicSteps({ enabled: true });

export default defineConfig({
  testDir: 'test',
  reporter: 'html',
});
