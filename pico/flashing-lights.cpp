#include <stdio.h>
#include "pico/stdlib.h"
#include "hardware/gpio.h"
#include "pico/binary_info.h"
#include <cstdint>
#include "pico7219.h"

static const uint8_t PIN_MOSI = 19;
static const uint8_t PIN_SCK = 18;
static const uint8_t PIN_CS = 17;
static const uint8_t CHAIN_LEN = 4;
static const PicoSpiNum SPI_CHAN = PICO_SPI_0;

typedef struct Pico7219 Pico7219;

static Pico7219 * pico7219;

static const size_t N_PIXELS = 64;

extern uint32_t pixel_phis_0[];
extern uint32_t pixel_phi_incrs[];
uint32_t pixel_phis[N_PIXELS];

static const uint32_t Frames_per_second = 100;
static const uint32_t Centre_n_cycles = 3600;
static const uint32_t Duration_frames = Centre_n_cycles * Frames_per_second;
static const uint32_t Half_duration_frames = Duration_frames / 2;

static uint8_t nibble(
    uint8_t idx_0,
    uint8_t off_76,
    uint8_t off_54,
    uint8_t off_32,
    uint8_t off_10
) {
    const uint32_t * pxl_0 = pixel_phis + idx_0;
    return ((pxl_0[off_10] < Half_duration_frames ? 0x03 : 0)
            | (pxl_0[off_32] < Half_duration_frames ? 0x0c : 0)
            | (pxl_0[off_54] < Half_duration_frames ? 0x30 : 0)
            | (pxl_0[off_76] < Half_duration_frames ? 0xc0 : 0));
}

int main()
{
}
