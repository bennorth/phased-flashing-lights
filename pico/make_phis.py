"""
Script to generate CPP code initialising phi and Dphi arrays
"""

from functools import reduce
from operator import concat


def image_from_filename(filename):
    with open(filename, "rt") as f_in:
        rows = [[int(ch) for ch in line.strip()] for line in f_in]
        if len(rows) != 8:
            raise ValueError(f"expecting 8 rows but got {len(rows)}")
        if any(len(row) != 8 for row in rows):
            raise ValueError("expecting 8 columns in every row")
        return reduce(concat, rows, [])
