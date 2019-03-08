#!/bin/bash

# Setup script error handling see https://disconnected.systems/blog/another-bash-strict-mode for details
set -xuo pipefail
trap 's=$?; echo "$0: Error on line "$LINENO": $BASH_COMMAND"; exit $s' ERR
IFS=$'\n\t'

NAME="Cabrito"
VERSION="0.1"


# npm install 

PATH=$(npm bin):$PATH


electron-packager . \
--appname=$NAME \
--build-version$VERSION \
--overwrite \
--platform=darwin \
--arch=x64 \
--icon=./images/goatIcon.icns \
--prune=true \
--out=release-builds \
--darwin-dark-mode-support 
# --out="./"
# cp -r ./release-builds/*/*.app ./

REL_FILE=$(find . -type d -name "$NAME.app")
echo "file created is $REL_FILE"