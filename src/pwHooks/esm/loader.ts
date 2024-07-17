/* eslint-disable @typescript-eslint/no-explicit-any */

import path from 'path';
import url from 'url';

export async function resolve(
  specifier: string,
  context: any,
  nextResolve: any,
) {
  const res = await nextResolve(specifier, context);
  // overwrite Playwright's esmLoader
  if (
    res.url.includes('/node_modules/playwright/') &&
    res.url.endsWith('esmLoader.js')
  ) {
    res.url = url.pathToFileURL(
      path.resolve(__dirname, './esmLoaderHooked.js'),
    ).href;
  }
  return res;
}
