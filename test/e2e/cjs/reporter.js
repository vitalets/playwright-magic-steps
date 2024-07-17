/**
 * Custom reporter that prints step info to stdout.
 */
import path from 'node:path';

class MyReporter {
  onStepEnd(test, result, step) {
    const { title, location } = step;
    const file = location?.file;
    const relFile = file ? path.relative(process.cwd(), file) : '';
    // eslint-disable-next-line no-console
    console.log(
      title,
      `${relFile}:${location?.line || 0}:${location?.column || 0}`,
    );
  }

  printsToStdio() {
    return true;
  }
}

export default MyReporter;
