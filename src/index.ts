/**
 * Intercept requiring of Playwright's transform module to inject magic-steps transform.
 * It works in both CJS and ESM mode.
 * In older PW versions, esmLoader requires the same transform module, so one hook covers both modes.
 * In newer PW versions, esmLoader runs in a separate worker, so we chain a loader before it.
 */

import { addHook } from 'pirates';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const playwrightDir = getPlaywrightDir();
const playwrightVersion = getPlaywrightVersion();
const pwTransformPath = getPwTransformPath();

// Convert to POSIX path with forward slashes
// to avoid issues on Windows with requiring this string.
const stepsModulePath = require.resolve('./steps').replace(/\\/g, '/');

const transformHookSignature =
  'function transformHook(originalCode, filename, moduleUrl) {';
const inject = `originalCode = require("${stepsModulePath}").transformMagicSteps(originalCode, filename);`;
const patchedSignature = `${transformHookSignature} ${inject}`;

addHook(
  (code) => {
    return code.replace(transformHookSignature, patchedSignature);
  },
  {
    ignoreNodeModules: false,
    matcher: (filename) => filename === pwTransformPath,
  },
);

if (playwrightVersion >= '1.57.0') {
  setupEsmHook();
}

function getPlaywrightDir() {
  return path.dirname(require.resolve('playwright/package.json'));
}

function getPlaywrightVersion() {
  const pkgPath = path.join(playwrightDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
    version: string;
  };
  return pkg.version;
}

// Since PW 1.60, transformHook moved from lib/transform/transform to lib/common/index.js.
function getPwTransformPath() {
  return playwrightVersion >= '1.60'
    ? require.resolve(path.join(playwrightDir, 'lib/common/index.js'))
    : require.resolve('playwright/lib/transform/transform');
}

// In newer PW versions, esmLoader.js is registered in a separate worker.
// We register our loader right after Playwright's one so (LIFO) ours runs first,
// then delegates to Playwright via nextLoad.
// We do not replace Playwright's loader: it keeps all resolution/transform/cache logic.
function setupEsmHook() {
  const esmHookUrl = pathToFileURL(require.resolve('./esmHook.mjs')).href;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodeModule = require('node:module') as {
    register: (
      specifier: string | URL,
      options?: Record<string, unknown>,
    ) => void;
  };
  const originalRegister = nodeModule.register.bind(nodeModule);

  nodeModule.register = (specifier, options) => {
    if (String(specifier).includes('/transform/esmLoader')) {
      // Keep Playwright loader in the chain, then register ours after it.
      originalRegister(specifier, options);
      originalRegister(esmHookUrl, {
        data: { stepsModulePath },
      });
      return;
    }

    originalRegister(specifier, options);
  };
}
