/**
 * Intercept requiring of Playwright's transform module to inject magic-steps transform.
 * It works in both CJS and ESM mode.
 * In PW < 1.60, Playwright's esmLoader requires the same transform module, so one hook covers both modes.
 * In PW >= 1.60, esmLoader is a self-contained worker bundle, so we pre-patch it as a temp file.
 */

import { addHook } from 'pirates';
import path from 'node:path';
import fs from 'node:fs';

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

const patchedEsmLoaderPath = createPatchedEsmLoader();

addHook(
  (code) => {
    let patched = code.replace(transformHookSignature, patchedSignature);
    if (patchedEsmLoaderPath) {
      // Redirect module.register() to use the pre-patched esmLoader.
      patched = patched.replace(
        'require.resolve("../transform/esmLoader.js")',
        JSON.stringify(patchedEsmLoaderPath),
      );
    }
    return patched;
  },
  {
    ignoreNodeModules: false,
    matcher: (filename) => filename === pwTransformPath,
  },
);

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

// In PW >= 1.60, esmLoader.js is a self-contained worker bundle with its own transformHook.
// module.register() loads it in a separate thread, so pirates hooks don't apply there.
// We pre-patch it and redirect common/index.js to use it instead.
function createPatchedEsmLoader() {
  if (playwrightVersion < '1.60') return '';
  const esmLoaderPath = path.join(playwrightDir, 'lib/transform/esmLoader.js');
  if (!fs.existsSync(esmLoaderPath)) return '';
  // Write the patched file next to the original so relative require() paths still resolve.
  const patchedPath = path.join(
    playwrightDir,
    'lib/transform/esmLoaderMagicSteps.js',
  );
  const patchedCode = fs
    .readFileSync(esmLoaderPath, 'utf-8')
    .replace(transformHookSignature, patchedSignature);
  fs.writeFileSync(patchedPath, patchedCode);
  process.on('exit', () => {
    try {
      fs.unlinkSync(patchedPath);
    } catch {
      // ignore
    }
  });
  return patchedPath;
}
