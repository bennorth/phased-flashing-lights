import pytest
import make_phis


class TestPhiIncrChoices:
    def test_values_odd_n(self):
        ch = make_phis.PhiIncrChoices.make(10, 3)
        assert sorted(ch.even) == [8, 10, 12]
        assert sorted(ch.odd) == [7, 9, 11, 13]

    def test_values_even_n(self):
        ch = make_phis.PhiIncrChoices.make(10, 4)
        assert sorted(ch.even) == [6, 8, 10, 12, 14]
        assert sorted(ch.odd) == [7, 9, 11, 13]

    def test_odd_freq0_rejected(self):
        pytest.raises(ValueError, make_phis.PhiIncrChoices.make, 11, 2)
