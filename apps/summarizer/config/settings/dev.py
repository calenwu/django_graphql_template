from .base import *

import socket

import os

import django
from django.utils.translation import gettext
from django.utils.translation import gettext, gettext_lazy
django.utils.translation.ugettext = gettext
django.utils.translation.ugettext_lazy = gettext_lazy

DEBUG = True
SECRET_KEY = os.getenv('SECRET_KEY')
ALLOWED_HOSTS = ['*']

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Logging
LOGGING['handlers']['console']['level'] = 'DEBUG'
LOGGING['handlers']['celery']['level'] = 'DEBUG'
LOGGING['handlers']['file_django']['level'] = 'DEBUG'
LOGGING['handlers']['file_daphne']['level'] = 'DEBUG'
LOGGING['loggers']['django']['level'] = 'DEBUG'
LOGGING['loggers']['celery']['level'] = 'DEBUG'

LOGGING = {
	'version': 1,
	'formatters': {
		'simple': {
			'format': '%(levelname)s %(asctime)s %(name)s.%(funcName)s:%(lineno)s- %(message)s'
		},
	},
	'handlers': {
		'file': {
			'level': 'INFO',
			'class': 'logging.FileHandler',
			'filename': 'logs/django_error.log',
			'formatter': 'simple'
		},
	},
	'loggers': {
		'django': {
			'handlers': ['file'],
			'level': 'INFO',
			'propagate': True,
		},
	}
}

INSTALLED_APPS += [
	'debug_toolbar',
	'graphiql_debug_toolbar',
]

MIDDLEWARE += [
	'graphiql_debug_toolbar.middleware.DebugToolbarMiddleware',
]

ip = socket.gethostbyname(socket.gethostname())
INTERNAL_IPS = [
	'0.0.0.0',
	'127.0.0.1',
]
