# Orthographies: Collections and simple wrappers for orthography profiles

Usage example:

```
>>> from orthographies import get_orthography
>>> wang = get_orthography('Wang1980')
>>> wang('tiang', column='IPA')
't i a ŋ'
>>> sino = get_orthograpy('SinoPy')
>>> sino('pian55', column='IPA')
'p j a n ⁵⁵'
```

