/**
 * Chained ESM loader for newer Playwright versions.
 * It runs before Playwright's esmLoader and intercepts file reads so
 * magic-steps runs before Playwright applies its transformHook.
 *
 * Why fs.readFileSync interception:
 * - In loader chaining, nextLoad() does not let us replace source for the same URL.
 * - Playwright's loader reads file contents internally, then transforms them.
 * - We temporarily patch readFileSync for this single file load so Playwright
 *   receives already-transformed source while keeping its own loader logic intact.
 */

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import type { InitializeHook, LoadHook } from 'node:module';

type TransformFn = (code: string, filename: string) => string;

let transformMagicSteps: TransformFn;

export const initialize: InitializeHook = (data) => {
  const { stepsModulePath } = data as {
    stepsModulePath: string;
  };
  const req = createRequire(import.meta.url);
  transformMagicSteps = (
    req(stepsModulePath) as { transformMagicSteps: TransformFn }
  ).transformMagicSteps;
};

export const resolve = async (
  specifier: string,
  context: { parentURL?: string },
  nextResolve: (...args: unknown[]) => Promise<unknown>,
) => {
  return nextResolve(specifier, context);
};

export const load: LoadHook = async (url, context, nextLoad) => {
  if (!url.startsWith('file://')) return nextLoad(url, context);

  const originalReadFileSync = fs.readFileSync.bind(fs);

  // Scope interception to this load call. Playwright's bundled loader can read
  // the target file through internal/normalized paths that may differ from url,
  // so path equality checks are too brittle across versions.
  fs.readFileSync = ((pathLike, options) => {
    const raw: unknown = originalReadFileSync(pathLike, options as never);
    if (typeof raw !== 'string') {
      return raw;
    }

    if (!raw.includes('// step:')) {
      return raw;
    }

    const pathString =
      typeof pathLike === 'string'
        ? pathLike
        : Buffer.isBuffer(pathLike)
          ? pathLike.toString()
          : pathLike instanceof URL
            ? fileURLToPath(pathLike)
            : String(pathLike);

    if (isNodeModulesPath(pathString)) {
      return raw;
    }

    const transformed = transformMagicSteps(raw, pathString);

    return transformed;
  }) as typeof fs.readFileSync;

  try {
    // Delegate all loader behavior to Playwright after source interception.
    return await nextLoad(url, context);
  } finally {
    // Always restore global fs state.
    fs.readFileSync = originalReadFileSync as typeof fs.readFileSync;
  }
};

function isNodeModulesPath(filePath: string) {
  return /(^|[\\/])node_modules([\\/]|$)/.test(filePath);
}
