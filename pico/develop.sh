#!/bin/bash

: "${PICO_SDK_PATH:?}"

[ -e pico_sdk_import.cmake ] || {
    cp "$PICO_SDK_PATH"/external/pico_sdk_import.cmake .
}

mkdir -p build

(
    cd build
    cmake ..
)
