set -e

yarn lint
yarn test
if [ -v ${1+x} ]; then
    yarn version
else
    yarn version --new-version $1
fi

yarn build:prod

cd dist/robingoupil/ng-srm-wrapper
yarn publish --access public --new-version `node -p -e "require('./package.json').version"`
cd -
