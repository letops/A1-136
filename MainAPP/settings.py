from os.path import abspath, dirname, join
import os

DJANGO_ROOT = dirname(dirname(abspath(__file__)))


INSTALLED_APPS = [
    'rest_framework.authtoken',
    'MainAPP',
]

MIDDLEWARE_CLASSES = []

TEMPLATES = {
    'DIRS': [
        os.path.join(DJANGO_ROOT, 'MainAPP/templates'),
    ],
    'extensions': [
        # 'contrib.django_intercom.jinja2_intercom.IntercomExtension'
    ],
    'constants': {},
}
TEMPLATES['DIRS'] = filter(None, TEMPLATES['DIRS'])

STATICFILES_DIRS = [
    os.path.join(DJANGO_ROOT, 'MainAPP/static'),
]
