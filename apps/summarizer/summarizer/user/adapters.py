import re
from django.core.exceptions import ValidationError
from django.shortcuts import redirect
from django.utils.translation import gettext as _
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

# https://owasp.org/www-community/password-special-characters
special_characters = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"


class CustomAccountAdapter(DefaultAccountAdapter):
	max_email_length = 254
	min_password_length = 8
	max_password_length = 128

	def clean_email(self, email):
		if len(email) > self.max_email_length:
			raise ValidationError(
				_('Your email cannot be longer than {} characters.'.format(self.max_email_length)),
				code='email_too_long',
			)
		return super().clean_email(email)

	def clean_password(self, password, user=None):
		if len(password) < self.min_password_length:
			raise ValidationError(
				_('Your password cannot be shorter than {} characters.'.format(self.min_password_length)),
				code='password_too_short',
			)
		if len(password) > self.max_password_length:
			raise ValidationError(
				_('Your password cannot be longer than {} characters.'.format(self.max_password_length)),
				code='password_too_long',
			)
		if not any(c in special_characters for c in password):
			raise ValidationError(
				_('Your password must contain a special character.'),
				code='special_character_missing',
			)
		if not any(x.isupper() for x in password):
			raise ValidationError(
				_('Your password must contain an upper case letter.'),
				code='upper_case_letter_missing',
			)
		if not any(x.islower() for x in password):
			raise ValidationError(
				_('Your password must contain a lower case letter.'),
				code='lower_case_letter_missing',
			)
		if not any(char.isdigit() for char in password):
			raise ValidationError(
				_('Your password must contain a a number.'),
				code='number_missing',
			)
		return super().clean_email(password)


class SocialAccountAdapter(DefaultSocialAccountAdapter):
	def save_user(self, request, sociallogin, form=None):
		return super(SocialAccountAdapter, self).save_user(request, sociallogin, form=form)
