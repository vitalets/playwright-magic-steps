/**
 * Custom reporter that prints step info to stdout.
 */

/* eslint-disable no-console */

import path from 'node:path';

export default class MyReporter {
  onTestEnd(test, result) {
    if (result.error) console.error(result.error.stack || result.error.message);
  }

  onStepEnd(test, result, step) {
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
