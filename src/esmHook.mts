/**
 * Chained ESM loader hook for Playwright >= 1.60.
 * Registered after Playwright's own esmLoader so that (LIFO) it runs first:
 *   1. Calls nextLoad → Playwright's hook transforms TS → JS (with comments preserved).
 *   2. Applies transformMagicSteps to the result.
 * No file writes required.
 */

import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import type { InitializeHook, LoadHook } from 'node:module';

type TransformFn = (code: string, filename: string) => string;

let transformMagicSteps: TransformFn;

export const initialize: InitializeHook = (data) => {
  const { stepsModulePath } = data as { stepsModulePath: string };
  const req = createRequire(import.meta.url);
  transformMagicSteps = (
    req(stepsModulePath) as { transformMagicSteps: TransformFn }
  ).transformMagicSteps;
};

export const load: LoadHook = async (url, context, nextLoad) => {
  const result = await nextLoad(url, context);
  if (!url.startsWith('file://') || !result.source) return result;

  const filename = fileURLToPath(url);
  // Skip node_modules — transformMagicSteps would be a no-op anyway, but skip for performance.
  if (filename.includes('node_modules')) return result;

  const source =
    typeof result.source === 'string'
      ? result.source
      : Buffer.from(result.source as Uint8Array).toString('utf-8');

  return { ...result, source: transformMagicSteps(source, filename) };
};
