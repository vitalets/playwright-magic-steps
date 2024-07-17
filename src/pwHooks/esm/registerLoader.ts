/**
 * Register loader hook to replace Playwright's esmLoader.js with own esmLoaderHooked.js.
 */
import { register } from 'node:module';
import url from 'url';
import path from 'path';

register(url.pathToFileURL(path.resolve(__dirname, './loader.js')));
