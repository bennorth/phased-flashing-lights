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
