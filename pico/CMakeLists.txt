cmake_minimum_required(VERSION 3.13)

include(pico_sdk_import.cmake)

project(flashing-lights C CXX ASM)

set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)

pico_sdk_init()

add_executable(flashing-lights
    flashing-lights.cpp
    phi-arrays.cpp
    pico7219.c
)

pico_add_extra_outputs(flashing-lights)
target_link_libraries(flashing-lights
    pico_stdlib
    hardware_spi
    hardware_gpio
)
