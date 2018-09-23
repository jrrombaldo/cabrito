#!/usr/bin/env bash
py2applet \
--resources=requirements.txt,cabritage.yml \
--dist-dir=/Applications \
--arch=x86_64 \
--make-setup Cabritage.py sketch.sh
rm -rf ./dist
rm -rf ./build
# with option -A, it will link the source instead of inluded i on the binary
python setup.py py2app
#open ./dist/Cabritage.app
