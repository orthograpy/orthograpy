# Orthographies: Collections and simple wrappers for orthography profiles


## Usage example

```
>>> from orthograpy import get_orthography
>>> wang = get_orthography('Wang1980')
>>> wang('tiang', column='IPA')
't i a ŋ'
>>> sino = get_orthograpy('SinoPy')
>>> sino('pian55', column='IPA')
'p j a n ⁵⁵'
```

## Structure of the Database

So far, we recognize a couple of regular columns of an orthography profile that we plan to systematically check for consistency in this project. First and most importantly, we distinguish between the Graphemes as we find them in the source, and their segmented form, which we call *Orthography* for the time being. 
Secondly, if a profile containts a column *IPA* we assume that it is supposed to represent some kind of IPA, conforming roughly to the prescriptions of the International Phonetic Alphabet. If a column is named *BIPA*, we assume it conforms to the B(road) IPA as it is defined by the Cross-Linguistic Transcription Systems initiative (https://clts.clld.org). We assume in all cases that the segments in the Orthography column have the same length as their counterparts in the IPA column and our tests make sure that this is the case. If a profile adds the column *Structure*, this means we assume some kind of phonotactic notation, which basically has a free form, as long as all elements in given unit are *unique*, only occuring once in that unit. We assume that the content of the Structure column is again of the same length as Orthography and IPA (or BIPA). 
