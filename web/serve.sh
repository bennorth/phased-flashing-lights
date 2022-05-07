#!/bin/bash

# To install live reload machinery:
#
#     npm install livereloadx

# TERM everything in process group when script exits.
# https://stackoverflow.com/a/2173421
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

[ -x ./node_modules/.bin/livereloadx ] || {
    echo Could not find livereloadx
    exit 1
}

mkdir -p dist

(
    cd dist
    exec ../node_modules/.bin/livereloadx --delay 100
) &

(
    cd dist
    exec python3 ../serve.py
) &

ls -1 index.md phased-flashing.css phased-flashing.js | exec entr ./make.sh dev
