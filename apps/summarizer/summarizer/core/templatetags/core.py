from django import template
from django.conf import settings
register = template.Library()


@register.filter
def site_name(val):
	return settings.SITE_NAME


@register.filter
def support_email(val):
	return settings.SUPPORT_EMAIL


@register.filter
def frontend_url(val):
	return settings.FRONTEND_URL


@register.simple_tag
def email_primary_color():
	return settings.EMAIL_PRIMARY_COLOR


@register.simple_tag
def email_primary_text_color():
	return settings.EMAIL_PRIMARY_TEXT_COLOR


@register.simple_tag
def email_secondary_color():
	return settings.EMAIL_SECONDARY_COLOR


@register.simple_tag
def email_secondary_text_color():
	return settings.EMAIL_SECONDARY_TEXT_COLOR


@register.simple_tag
def email_logo_url():
	return settings.EMAIL_LOGO_URL


@register.filter
def adjust_email_activation_url(url: str):
	"""
	Adjust email activation url from allauth. Changes the domain to frontend url
	:param url: url from allauth
	:return: adjusted url
	"""
	return f'{settings.FRONTEND_URL}/accounts{url.split('/accounts')[1]}'
