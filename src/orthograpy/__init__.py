from pathlib import Path
from segments import Tokenizer, Profile
import json
import glob
from segments.util import nfd

__version__ = '0.1.1.dev0'


def profile_path(*comps):
    return Path(__file__).parent.joinpath('data', *comps)


def get_orthography(name):
    return Tokenizer(Profile.from_file(profile_path(name + '.tsv'),
        form='NFD'))


def create_profiles():
    
    profiles = glob.glob(profile_path('*.tsv').as_posix())
    D = {'_profiles_': []}
    
    with open(Path(__file__).parent.parent.parent.joinpath('app',
        'profiles.js').as_posix(), 'w') as f:

        for profile in profiles:
            pname = profile.split('/')[-1][:-4]
            if not pname in ['orthographies']:
                print(pname)
                prf = get_orthography(pname)
                D[pname] = prf.op.graphemes
                D['_profiles_'] += [pname]
                D[pname+'_labels'] = ['Grapheme']+sorted(prf.op.column_labels)
        
        f.write('var PROFILE='+json.dumps(D, indent=2)+';')

