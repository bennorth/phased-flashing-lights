"""
Script to generate CPP code initialising phi and Dphi arrays
"""

from functools import reduce
from operator import concat
from random import shuffle
from dataclasses import dataclass
from typing import List


N_Pixels = 64
Image_Filename_Template = "image-{}.txt"

Centre_N_Periods = 3600
Duration_Frames = Centre_N_Periods * 100


def image_from_filename(filename):
    with open(filename, "rt") as f_in:
        rows = [[int(ch) for ch in line.strip()] for line in f_in]
        if len(rows) != 8:
            raise ValueError(f"expecting 8 rows but got {len(rows)}")
        if any(len(row) != 8 for row in rows):
            raise ValueError("expecting 8 columns in every row")
        return reduce(concat, rows, [])


@dataclass
class PhiIncrChoices:
    even: List[int]
    odd: List[int]

    @classmethod
    def make(cls, freq0, n):
        if (freq0 % 2) != 0:
            raise ValueError("freq0 must be even")

        even = [freq0]
        for i in range(1, n // 2 + 1):
            even.append(freq0 + 2 * i)
            even.append(freq0 - 2 * i)

        odd = []
        for i in range(0, (n + 1) // 2):
            odd.append(freq0 + 2 * i + 1)
            odd.append(freq0 - 2 * i - 1)

        return cls(even, odd)


def choose_phis_dphis():
    images = [
        image_from_filename(Image_Filename_Template.format(i))
        for i in [0, 1]
    ]

    all_idxs = list(range(N_Pixels))
    shuffle(all_idxs)

    # Start with arbitrary values; will be overwritten.
    phis = [0] * N_Pixels
    phi_incrs = [0] * N_Pixels

    choices = PhiIncrChoices.make(Centre_N_Periods, N_Pixels)

    for i in all_idxs:
        match = (images[0][i] == images[1][i])
        phi_incrs[i] = (choices.even if match else choices.odd).pop(0)

        lit0 = (images[0][i] == 1)
        phis[i] = (1 if lit0 else 3) * Duration_Frames // 4;

    return phis, phi_incrs


def cpp_array(name, values):
    n_values = len(values)
    txt = f"uint32_t {name}[{n_values}] = {{\n"
    for idx0 in range(0, n_values, 12):
        chunk = values[idx0 : idx0 + 12]
        chunk_txt = ", ".join(map(str, chunk))
        suffix = "," if idx0 < n_values - 12 else ""
        txt += f"  {chunk_txt}{suffix}\n"
    txt += "};\n"
    return txt
