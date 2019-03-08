#!/bin/bash

# Setup script error handling see https://disconnected.systems/blog/another-bash-strict-mode for details
set -xuo pipefail
trap 's=$?; echo "$0: Error on line "$LINENO": $BASH_COMMAND"; exit $s' ERR
IFS=$'\n\t'

VERSION="0.1"
# getting appname from package.json
APPNAME=$(node -p "require('./package.json').productName")

# npm install 

PATH=$(npm bin):$PATH


electron-packager . \
--executable-name=$APPNAME \
--build-version=$VERSION \
--overwrite \
--platform=darwin \
--arch=x64 \
--icon=./images/goatIcon.icns \
--prune=true \
--out=release-builds \
--darwin-dark-mode-support 
# --out="./"
# cp -r ./release-builds/*/*.app ./

REL_FILE=$(find . -type d -name "$APPNAME.app")
echo "file created is $REL_FILE"

# # # .travis.yml cabrito.zip to create the release
#  also expecting the directory to always be release-builds
cd ./release-builds/$APPNAME-darwin-x64/
zip -r ../../cabrito.zip ./$APPNAME.app

