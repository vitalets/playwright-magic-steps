#!/bin/bash

# Exit on any error
set -euo pipefail

rm -rf ./dist
npx tsc -p tsconfig.build.json

# make 'node_mosules/playwright-magic-steps' in 'test' dir:
# - Playwright does not transpile it b/c node_modules in path!
rm -rf ./test/node_modules/playwright-magic-steps
mkdir -p ./test/node_modules/playwright-magic-steps
cp -R ./dist ./test/node_modules/playwright-magic-steps/
cp ./package.json ./test/node_modules/playwright-magic-steps/package.json

# make 'node_mosules/playwright-magic-steps' in 'example' dir:
rm -rf ./example/node_modules/playwright-magic-steps
mkdir -p ./example/node_modules/playwright-magic-steps
cp -R ./dist ./example/node_modules/playwright-magic-steps/
cp ./package.json ./example/node_modules/playwright-magic-steps/package.json