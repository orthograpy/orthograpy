from lingpy import *
import json
from bxs import sampa
from unicodedata import normalize
from pyclts.transcriptionsystem import TranscriptionSystem
from lingpy.data.ipa.sampa import xs

bipa = TranscriptionSystem('bipa')

data = csv2list('graphemes.tsv')

prof = [['Grapheme', 'IPA', 'BIPA', 'CLTS_Name']]
visited = set()


mapper = {}
for k, v in sampa.items():
    if 'U+' in v['ipa']:
        v['ipa'] = chr(int('0x'+v['ipa'][2:], 0))
    mapper[normalize('NFD', v['ipa'])] = v['grapheme']
    mapper[normalize('NFC', v['ipa'])] = v['grapheme']

    sound = bipa[v['ipa']]
    if not sound.type in ['unknownsound', 'marker']:
        mapper[sound.s] = v['grapheme']
        
        if v['grapheme'] not in visited:
            prof += [[v['grapheme'], v['ipa'], sound.s, sound.name.replace(' ', '_')]]
            visited.add(v['grapheme'])
    elif sound.type == 'unknownsound':
        if not ',' in v['grapheme'] and not '"' in v['grapheme']:
            prof += [[r''+v['grapheme'], v['ipa'], '◌'+v['ipa'], 'NULL']]
            visited.add(v['grapheme'])

for k, v in xs.items():
    sound = bipa[v]
    if not sound.type in ['unknownsound', 'marker']:
        mapper[sound.s] = k
        if k not in visited:
            prof += [[k, v, sound.s, sound.name.replace(' ', '_')]]
            visited.add(k)
    elif sound.type == 'unknownsound':
        if not ',' in k and not '"' in k and not k in visited:
            prof += [[r''+k, v, '◌'+v, 'NULL']]
            visited.add(k)

        

for a, b, c in zip(
        '⁰¹²³⁴⁵⁶⁷⁸⁹', '₀₁₂₃₄₅₆₇₈₉', '0123456789'):
    mapper[a] = '^'+c
    mapper[b] = '_'+c

for x in 'abcdefghijklmnopqrstuvwxyz':
    mapper[x] = x


mapper['’'] = '_>'

for line in data[1:]:
    if 'pbase' in line or 'phoible' in line or 'bipa' in line or 'nidaba' in line:
        grapheme = r''
        graph = line[0]
        ipa = bipa[line[1]].s
        for char in normalize('NFD', graph): #, 'NFD'):
            grapheme += mapper.get(char, '???')
        if '???' in grapheme:
            grapheme = r''
            for char in normalize('NFC', graph):
                grapheme += mapper.get(char, '???')
            if not '???' in grapheme:
                if grapheme not in visited:
                    prof += [[grapheme, graph, ipa, line[1].replace(' ', '_')]]
                    visited.add(grapheme)
            else:
                print(line[0], grapheme)
        else:
            if grapheme not in visited:
                prof += [[grapheme, graph, ipa, line[1].replace(' ', '_')]]
                visited.add(grapheme)

prof += [['.', 'NULL', 'NULL']]

with open('../src/orthograpy/data/XSampa.tsv', 'w') as f:
    f.write('\n'.join(['\t'.join(line) for line in prof]))

from orthograpy import create_profiles
create_profiles()
