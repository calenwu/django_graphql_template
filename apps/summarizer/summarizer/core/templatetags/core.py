from django import template
from django.conf import settings
register = template.Library()


@register.filter
def site_name(val):
	print(settings.SITE_NAME)
	return settings.SITE_NAME


@register.filter
def support_email(val):
	print(settings.SUPPORT_EMAIL)
	return settings.SUPPORT_EMAIL


@register.filter
def frontend_url(val):
	print(settings.FRONTEND_URL)
	return settings.FRONTEND_URL


@register.filter
def adjust_email_activation_url(url: str):
	"""
	Adjust email activation url from allauth. Changes the domain to frontend url
	:param url: url from allauth
	:return: adjusted url
	"""

	print(f'{settings.FRONTEND_URL}/accounts{url.split('/accounts')[1]}')
	return f'{settings.FRONTEND_URL}/accounts{url.split('/accounts')[1]}'
