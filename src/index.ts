/**
 * Intercept requiring of Playwright's transform module to inject magic-steps transform.
 * It works in both CJS and ESM mode.
 * In ESM mode, Playwright's esmLoader also requires this transform module beforehand.
 */

import { addHook } from 'pirates';

const pwTransformPath = require.resolve('playwright/lib/transform/transform');
const stepsModulePath = require.resolve('./steps');

addHook(
  (code) => {
    const inject = `originalCode = require("${stepsModulePath}").transformMagicSteps(originalCode, filename);`;

    return code.replace(
      'function transformHook(originalCode, filename, moduleUrl) {',
      `function transformHook(originalCode, filename, moduleUrl) { ${inject}`,
    );
  },
  {
    ignoreNodeModules: false,
    matcher: (filename) => {
      return filename === pwTransformPath;
    },
  },
);
