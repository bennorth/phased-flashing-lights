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

int main()
{
}
