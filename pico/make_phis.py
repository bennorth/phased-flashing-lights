"""
Script to generate CPP code initialising phi and Dphi arrays
"""

from functools import reduce
from operator import concat
from dataclasses import dataclass
from typing import List


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
