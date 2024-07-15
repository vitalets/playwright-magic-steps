import path from 'node:path';

const pwRoot = resolvePackageRoot('playwright');

type HookFn = (code: string, filename: string) => string;

export function hookBabelTransform(hookFn: HookFn) {
  const babelBundle = require(`${pwRoot}/lib/transform/babelBundle.js`);
  const orig = babelBundle.babelTransform;
  babelBundle.babelTransform = (
    originalCode: string,
    filename: string,
    ...args: unknown[]
  ) => {
    const code = hookFn(originalCode, filename);
    return orig.call(babelBundle, code, filename, ...args);
  };
}

function resolvePackageRoot(packageName: string) {
  const packageJsonPath = require.resolve(`${packageName}/package.json`);
  return path.dirname(packageJsonPath);
}
