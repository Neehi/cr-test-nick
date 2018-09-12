import os
import socket

from .base import *
from .base import INSTALLED_APPS, MIDDLEWARE, REST_FRAMEWORK

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'CHANGEME!!!')

# SECURITY WARNING: don't run with debug turned on in production!

DEBUG = (
    not os.getenv('DJANGO_DEBUG') or
    os.getenv('DJANGO_DEBUG').lower() in BOOLEAN_TRUE_STRINGS
)

# https://docs.djangoproject.com/en/dev/ref/settings/#allowed-hosts

ALLOWED_HOSTS = (
    os.getenv('DJANGO_ALLOWED_HOSTS') or 'localhost,127.0.0.1'
).split(',')

# TODO: Remove if not needed
# # Debug Toolbar
#
# INSTALLED_APPS += ['debug_toolbar', ]
# MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware', ]

INTERNAL_IPS = ['127.0.0.1', ]

# hack for docker
ip = socket.gethostbyname(socket.gethostname())
INTERNAL_IPS += [ip[:-1] + '1']

DEBUG_TOOLBAR_CONFIG = {
    'DISABLE_PANELS': [
        'debug_toolbar.panels.redirects.RedirectsPanel',
    ],
    'SHOW_TEMPLATE_CONTEXT': True,
}
