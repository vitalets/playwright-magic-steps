/**
 * Custom reporter that prints step info to stdout.
 */

/* eslint-disable no-console */

import {
  Reporter,
  TestStep,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import path from 'node:path';

export default class MyReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    if (result.error) console.error(result.error.stack || result.error.message);
  }

  onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
    const { title, location } = step;
    const file = location?.file;
    const relFile = file ? path.relative(process.cwd(), file) : '';
    console.log(
      title,
      `${relFile}:${location?.line || 0}:${location?.column || 0}`,
    );
  }

  printsToStdio() {
    return true;
  }
}
