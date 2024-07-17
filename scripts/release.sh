#!/bin/bash

# Exit on any error
set -euo pipefail

npm run lint
npm run prettier
npm ci
npm run test:all
npm run example
# npm run build <- called inside npm run test:all
SKIP_GIT_HOOKS=1 npx np --yolo --no-release-draft --any-branch
