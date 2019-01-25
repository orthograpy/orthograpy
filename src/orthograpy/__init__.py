from pathlib import Path
from segments import Tokenizer


def profile_path(*comps):
    return Path(__file__).parent.joinpath('data', *comps)


def get_orthography(name):
    return Tokenizer(profile_path(name + '.tsv'))

