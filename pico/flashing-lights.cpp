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

int main()
{
}
