#! /bin/bash
set -e

yarn lint
yarn test

yarn build:prod

cd dist/nicecactus/ng-srm-wrapper
yarn publish --access public --new-version `node -p -e "require('./package.json').version"`
cd -
