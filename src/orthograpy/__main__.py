import argparse

from orthograpy import get_orthography


def main(args=None):
    parser = argparse.ArgumentParser(description='Segment orthography')
    parser.add_argument('profile', help='Name of an orthography profile')
    parser.add_argument('text', help='Text to segment')
    args = parser.parse_args(args)
    orth = get_orthography(args.profile)
    print(orth(args.text, column='IPA'))

