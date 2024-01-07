from .base import *

import django
from django.utils.translation import gettext, gettext_lazy
django.utils.translation.ugettext = gettext
django.utils.translation.ugettext_lazy = gettext_lazy

ACCOUNT_DEFAULT_HTTP_PROTOCOL = 'https'

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'