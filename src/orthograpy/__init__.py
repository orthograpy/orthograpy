from pathlib import Path
from segments import Tokenizer

__version__ = '0.1.1.dev0'


def profile_path(*comps):
    return Path(__file__).parent.joinpath('data', *comps)


def get_orthography(name):
    return Tokenizer(str(profile_path(name + '.tsv')))

