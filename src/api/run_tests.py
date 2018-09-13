#! /usr/bin/env python

import argparse
import os
import subprocess
import sys

import django
from django.conf import settings
from django.test.utils import get_runner


DJANGO_SETTINGS_MODULE = 'tests.settings'

TEST_ARGS = ['tests']

PYCODESTYLE_ARGS = ['--exclude=migrations*,tests*', 'testapp', ]

ISORT_ARGS = ['--recursive', '--check-only', 'testapp', ]


def exit_on_failure(ret):
    if ret:
        sys.exit(ret)


def run_tests(verbosity=1):
    print('========================================')
    print(' Running unit tests...')
    print('========================================')
    os.environ['DJANGO_SETTINGS_MODULE'] = DJANGO_SETTINGS_MODULE
    django.setup()
    TestRunner = get_runner(settings)
    test_runner = TestRunner(verbosity=verbosity)
    failures = test_runner.run_tests(TEST_ARGS)
    print('tests {}'.format('failed' if failures else 'passed'))
    return failures


def run_linter(linter, args):
    print('========================================')
    print(' Running {} checks...'.format(linter))
    print('========================================')
    ret = subprocess.call([linter] + args, shell=False)
    print('{} checks {}'.format(linter, 'failed' if ret else 'passed'))
    return ret


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the test suite.")
    parser.add_argument(
        '-v', '--verbosity', default=1, type=int, choices=[0, 1, 2],
        help='Verbosity level; 0=minimal, 1=normal (default), 2=verbose.',
    )
    parser.add_argument(
        '--nolint', action='store_false', dest='lint',
        help='Skip the linter checks.',
    )
    options = parser.parse_args()

    exit_on_failure(run_tests(options.verbosity))

    if options.lint:
        exit_on_failure(run_linter('pycodestyle', PYCODESTYLE_ARGS))
        exit_on_failure(run_linter('isort', ISORT_ARGS))
