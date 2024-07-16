/* eslint-disable @typescript-eslint/no-explicit-any */

import path from 'path';
import url from 'url';

export async function resolve(
  specifier: string,
  context: any,
  nextResolve: any,
) {
  const res = await nextResolve(specifier, context);
  // todo: check full path
  if (res.url.endsWith('transform/esmLoader.js')) {
    res.url = url.pathToFileURL(
      path.resolve(__dirname, './esmLoaderHooked.js'),
    ).href;
  }
  return res;
}
