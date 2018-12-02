PATH=$(npm bin):$PATH

electron-packager . \
--overwrite \
--platform=darwin \
--arch=x64 \
--icon=./images/goatIcon.icns \
--prune=true \
--out=release-builds \
--darwin-dark-mode-support 
# cp -r ./release-builds/*/*.app ./