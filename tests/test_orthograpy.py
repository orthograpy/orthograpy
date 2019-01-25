import pytest

from orthograpy import get_orthography


@pytest.mark.parametrize(
    'profile,form,segmented',
    [
        ('Wang1980', 'tiang', 't i a ŋ'),
        ('SinoPy', 'pian55', 'p j a n ⁵⁵'),
    ]
)
def test_orthograpy(profile, form, segmented):
    orth = get_orthography(profile)
    assert orth(form, column='IPA') == segmented

