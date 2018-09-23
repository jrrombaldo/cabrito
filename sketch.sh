#!/usr/bin/env bash
date 0102030405
date
sudo -u $1 open /Applications/Sketch.app/
ntpdate -u time.apple.com
date