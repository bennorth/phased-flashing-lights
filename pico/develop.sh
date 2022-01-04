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

[ -d venv ] || {
    echo Creating Python venv...

    python3 -m venv venv
    (
        . venv/bin/activate
        pip install --upgrade pip
        pip install pytest
    )
}

echo
echo Now run '"'source venv/bin/activate'"'
