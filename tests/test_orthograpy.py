import pytest

from orthograpy import get_orthography
from orthograpy.__main__ import main


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


def test_main(capsys):
    main(['Wang1980', "tiang"])
    out, _ = capsys.readouterr()
    assert 't i a ŋ' in out

