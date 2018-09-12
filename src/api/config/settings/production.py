import os

from .base import *
from .base import INSTALLED_APPS, MIDDLEWARE, REST_FRAMEWORK

# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')

# https://docs.djangoproject.com/en/dev/ref/settings/#allowed-hosts

ALLOWED_HOSTS = (
    os.getenv('DJANGO_ALLOWED_HOSTS').split(',')
    if os.getenv('DJANGO_ALLOWED_HOSTS')
    else []
)
