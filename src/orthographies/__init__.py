from clldutils.path import Path, remove, path_component
from segments import Tokenizer

def profile_path(*comps):
    return Path(__file__).parent.joinpath('data', *comps).as_posix()

def get_orthography(name):
    return Tokenizer(profile_path(name+'.tsv'))
