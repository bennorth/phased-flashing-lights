#include <stdio.h>
#include "pico/stdlib.h"
#include "hardware/gpio.h"
#include "pico/binary_info.h"
#include <cstdint>
#include <cstring>
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

static const uint32_t Leap_lead_in_frames = 15 * Frames_per_second;


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

static void refresh_all()
{
  uint8_t row_bits[4 * CHAIN_LEN];

  // Hardly worth working out a loop to do this:

  row_bits[0] = nibble(0 * 8, 0, 1, 2, 3);
  row_bits[1] = nibble(4 * 8, 0, 1, 2, 3);
  row_bits[2] = nibble(3 * 8, 7, 6, 5, 4);
  row_bits[3] = nibble(7 * 8, 7, 6, 5, 4);

  row_bits[4] = nibble(1 * 8 , 0, 1, 2, 3);
  row_bits[5] = nibble(5 * 8, 0, 1, 2, 3);
  row_bits[6] = nibble(2 * 8, 7, 6, 5, 4);
  row_bits[7] = nibble(6 * 8, 7, 6, 5, 4);

  row_bits[8] = nibble(2 * 8, 0, 1, 2, 3);
  row_bits[9] = nibble(6 * 8, 0, 1, 2, 3);
  row_bits[10] = nibble(1 * 8, 7, 6, 5, 4);
  row_bits[11] = nibble(5 * 8, 7, 6, 5, 4);

  row_bits[12] = nibble(3 * 8, 0, 1, 2, 3);
  row_bits[13] = nibble(7 * 8, 0, 1, 2, 3);
  row_bits[14] = nibble(0 * 8, 7, 6, 5, 4);
  row_bits[15] = nibble(4 * 8, 7, 6, 5, 4);

  pico7219_set_row_bits(pico7219, 0, &row_bits[0]);
  pico7219_set_row_bits(pico7219, 1, &row_bits[0]);
  pico7219_set_row_bits(pico7219, 2, &row_bits[4]);
  pico7219_set_row_bits(pico7219, 3, &row_bits[4]);
  pico7219_set_row_bits(pico7219, 4, &row_bits[8]);
  pico7219_set_row_bits(pico7219, 5, &row_bits[8]);
  pico7219_set_row_bits(pico7219, 6, &row_bits[12]);
  pico7219_set_row_bits(pico7219, 7, &row_bits[12]);
}

void leap_to_frame(uint32_t frame_idx)
{
    for (size_t i = 0; i < N_PIXELS; ++i)
        pixel_phis[i] = (
            (pixel_phis_0[i] + frame_idx * pixel_phi_incrs[i])
            % Duration_frames
        );
}

void one_frame()
{
    for (uint8_t i = 0; i != N_PIXELS; ++i) {
      pixel_phis[i] += pixel_phi_incrs[i];
      if (pixel_phis[i] > Duration_frames)
        pixel_phis[i] -= Duration_frames;
    }
}

int main()
{
  pico7219 = pico7219_create(SPI_CHAN,
                             800 * 1000,  // Originally 1500 * 1000; trying slower to see if more reliable
                             PIN_MOSI,
                             PIN_SCK,
                             PIN_CS,
                             CHAIN_LEN,
                             FALSE);

  pico7219_switch_off_all(pico7219, TRUE);
  pico7219_set_intensity(pico7219, 15);

  memcpy(pixel_phis, pixel_phis_0, N_PIXELS * sizeof(uint32_t));

  while (1)
  {
      sleep_ms(10);
      one_frame();
      refresh_all();
  }

  // For completeness, but we never get here...
  pico7219_destroy(pico7219, FALSE);
}
