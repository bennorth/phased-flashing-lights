#!/bin/bash

mkdir -p dist

GITHUB_MARKDOWN_CSS=dist/github-markdown.css
GITHUB_MARKDOWN_CSS_URL=https://raw.githubusercontent.com/sindresorhus/github-markdown-css/gh-pages/github-markdown.css

JQUERY_JS=dist/jquery-3.6.0.slim.min.js
JQUERY_JS_URL=https://code.jquery.com/jquery-3.6.0.slim.min.js

if [ ! -f $GITHUB_MARKDOWN_CSS ]; then
    curl -o $GITHUB_MARKDOWN_CSS $GITHUB_MARKDOWN_CSS_URL
fi

if [ ! -f $JQUERY_JS ]; then
    curl -o $JQUERY_JS $JQUERY_JS_URL
fi

checksum=$(openssl dgst -binary -sha256 < $JQUERY_JS | base64)
if [ ! $checksum = "u7e5khyithlIdTpu22PHhENmPcRdFiHRjhAuHcs05RI=" ]; then
    echo Bad checksum for $JQUERY_JS_URL
    exit 1
fi

EXTRA_SCRIPT=""
if [ "$1" = "dev" ]; then
    EXTRA_SCRIPT="-A ./include-livereload.html"
fi

pandoc -s \
       -f gfm \
       --template template.html \
       -o dist/index.html \
       -c ./github-markdown.css \
       -c ./phased-flashing.css \
       $EXTRA_SCRIPT \
       --metadata title="Two pictures in a grid of flashing lights" \
       index.md

cp phased-flashing.js phased-flashing.css dist

if ! command -v convert > /dev/null; then
    echo "Imagemagick utility 'convert' not found; cannot scale images"
else
    convert ../photos/front.jpg -resize 360x360 dist/front.jpg
    convert ../photos/back.jpg -resize 360x360 dist/back.jpg
fi
