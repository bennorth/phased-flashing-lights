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


class TestCppArray:
    def test_complete_last_row(self):
        got_txt = make_phis.cpp_array(
            "foo",
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
             201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212]
        )
        exp_txt = "\n".join([
            "uint32_t foo[24] = {",
            "  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,",
            "  201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212",
            "};\n"
        ])
        assert got_txt == exp_txt

    def test_incomplete_last_row(self):
        got_txt = make_phis.cpp_array(
            "foo",
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
             201, 202, 203, 204, 205, 206, 207, 208]
        )
        exp_txt = "\n".join([
            "uint32_t foo[20] = {",
            "  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,",
            "  201, 202, 203, 204, 205, 206, 207, 208",
            "};\n"
        ])
        assert got_txt == exp_txt

    def test_singleton_last_row(self):
        got_txt = make_phis.cpp_array(
            "foo",
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
             201]
        )
        exp_txt = "\n".join([
            "uint32_t foo[13] = {",
            "  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,",
            "  201",
            "};\n"
        ])
        assert got_txt == exp_txt
