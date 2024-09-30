import { test } from '@playwright/test';
import { step, helper } from './step-helper';

test('Check home page', async ({}) => {
  // step: Open home page
  await step();

  await helper();
  // step: Click 'Get started' link
  await step();
  // step: Check page title
  await step();
});
