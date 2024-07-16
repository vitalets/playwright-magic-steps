import path from 'node:path';

const pwRoot = resolvePackageRoot('playwright');

type HookFn = (code: string, filename: string) => string;

export function hookPirates(hookFn: HookFn) {
  const utilsBundle = require(`${pwRoot}/lib/utilsBundle.js`);
  const orig = utilsBundle.pirates;
  utilsBundle.pirates = {
    addHook: (fn: HookFn, ...args: unknown[]) => {
      const wrappedFn: HookFn = (code, filename) => {
        if (shouldTransform(filename)) {
          code = hookFn(code, filename);
        }
        return fn(code, filename);
      };
      return orig.addHook(wrappedFn, ...args);
    },
  };
}

export function hookTransform(hookFn: HookFn) {
  const transformModule = require(`${pwRoot}/lib/transform/transform.js`);
  const orig = transformModule.transformHook;
  transformModule.transformHook = (
    code: string,
    filename: string,
    ...args: unknown[]
  ) => {
    code = hookFn(code, filename);
    return orig(code, filename, ...args);
  };
}

function shouldTransform(filename: string) {
  const transformModule = require(`${pwRoot}/lib/transform/transform.js`);
  return transformModule.shouldTransform?.(filename);
}

function resolvePackageRoot(packageName: string) {
  const packageJsonPath = require.resolve(`${packageName}/package.json`);
  return path.dirname(packageJsonPath);
}
