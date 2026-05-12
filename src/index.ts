/**
 * Intercept requiring of Playwright's transform module to inject magic-steps transform.
 * It works in both CJS and ESM mode.
 * In PW < 1.60, Playwright's esmLoader requires the same transform module, so one hook covers both modes.
 * In PW >= 1.60, esmLoader is a self-contained worker bundle, so we register a chained ESM hook.
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

// For CJS mode: patch transformHook in Playwright's transform module via pirates.
addHook((code) => code.replace(transformHookSignature, patchedSignature), {
  ignoreNodeModules: false,
  matcher: (filename) => filename === pwTransformPath,
});

// For ESM mode in PW >= 1.60: register a chained ESM loader hook.
// (In PW < 1.60, esmLoader.js requires the same transform module, so the pirates hook above covers ESM too.)
if (playwrightVersion >= '1.60.0') {
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
  return playwrightVersion >= '1.60.0'
    ? require.resolve(path.join(playwrightDir, 'lib/common/index.js'))
    : require.resolve('playwright/lib/transform/transform');
}

// In PW >= 1.60, esmLoader.js is a self-contained worker bundle with its own copy of transformHook.
// module.register() loads it in a separate thread, so pirates hooks don't reach it.
// Solution: monkey-patch Module.register so that when Playwright registers its esmLoader,
// we immediately register our own ESM hook after it. LIFO ordering means our hook runs first,
// calls nextLoad to get Playwright's babel-compiled output, then applies transformMagicSteps.
function setupEsmHook() {
  const esmHookUrl = pathToFileURL(require.resolve('./esmHook.mjs')).href;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodeModule = require('node:module') as {
    register: (...args: unknown[]) => void;
  };
  const originalRegister = nodeModule.register.bind(nodeModule);
  let registered = false;
  nodeModule.register = (...args: unknown[]) => {
    originalRegister(...args);
    // Detect Playwright registering its esmLoader and piggyback our hook right after.
    if (!registered && String(args[0]).includes('esmLoader')) {
      registered = true;
      originalRegister(esmHookUrl, { data: { stepsModulePath } });
    }
  };
}
