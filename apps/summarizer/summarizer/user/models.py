from calendar import timegm
from datetime import datetime, timezone as dt_timezone
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.core.cache import cache
from django.dispatch import receiver
from django.db import models
from django.utils.translation import gettext_lazy as _
from graphql_jwt.settings import jwt_settings
from graphql_jwt import signals as graphql_jwt_signals
from allauth.account.models import EmailAddress
from allauth.account.signals import email_confirmed


class CustomUserManager(BaseUserManager):
	"""
	Custom user model manager where email is the unique identifiers
	for authentication instead of usernames.
	"""

	def create_user(self, email, password, **extra_fields):
		"""
		Create and save a user with the given email and password.
		"""
		if not email:
			raise ValueError(_("The Email must be set"))
		email = self.normalize_email(email)
		user = self.model(email=email, **extra_fields)
		user.set_password(password)
		user.save()
		return user

	def create_superuser(self, email, password, **extra_fields):
		"""
		Create and save a SuperUser with the given email and password.
		"""
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)
		extra_fields.setdefault('is_active', True)

		if extra_fields.get('is_staff') is not True:
			raise ValueError(_('Superuser must have is_staff=True.'))
		if extra_fields.get('is_superuser') is not True:
			raise ValueError(_('Superuser must have is_superuser=True.'))
		return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
	TIMEZONES = settings.ALL_TIMEZONES

	username = None
	email = models.EmailField(_('Email address'), unique=True)
	timezone = models.CharField(max_length=63, choices=TIMEZONES, default='UTC')

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = []

	objects = CustomUserManager()

	def __str__(self):
		return self.email

	def previous_jwt_token_key(self):
		"""
		User to revoke previous JWT token
		For example when user changes their password you need to revoke all previous tokens
		:return:
		"""
		return f'prev_{self.id}'

	def get_revoke_jwt_token_iat(self) -> datetime:
		return cache.get(self.previous_jwt_token_key())

	def revoke_previous_jwt_token(self, time: int = 0):
		if not time:
			time = int(datetime.now(dt_timezone.utc).timestamp())
		cache.set(self.previous_jwt_token_key(), time, 900)

	def add_email_address(self, request, new_email):
		# Add a new email address for the user, and send email confirmation.
		# Old email will remain the primary until the new one is confirmed.
		return EmailAddress.objects.add_email(request, self, new_email, confirm=True)

	def get_jwt_token(self, context: dict, cls) -> tuple[str, dict, int]:
		"""
		https://github.com/flavors/django-graphql-jwt/blob/0debe4fbd5299e394ee253e6fa77e7a68b3236ba/graphql_jwt/decorators.py#L87
		https://github.com/flavors/django-graphql-jwt/blob/0debe4fbd5299e394ee253e6fa77e7a68b3236ba/graphql_jwt/decorators.py#L72
		"""
		context._jwt_token_auth = True
		payload = jwt_settings.JWT_PAYLOAD_HANDLER(self, context)
		token = jwt_settings.JWT_ENCODE_HANDLER(payload, context)
		graphql_jwt_signals.token_issued.send(sender=cls, request=context, user=self)
		expires_in = timegm(datetime.utcnow().utctimetuple()) + jwt_settings.JWT_REFRESH_EXPIRATION_DELTA.total_seconds()
		return token, payload, expires_in

	@staticmethod
	def get_user_jwt_token(email: str, password: str, context: dict, cls) -> tuple[str, dict, int]:
		"""
		https://github.com/flavors/django-graphql-jwt/blob/0debe4fbd5299e394ee253e6fa77e7a68b3236ba/graphql_jwt/decorators.py#L87
		https://github.com/flavors/django-graphql-jwt/blob/0debe4fbd5299e394ee253e6fa77e7a68b3236ba/graphql_jwt/decorators.py#L72
		"""
		context._jwt_token_auth = True
		user = authenticate(
			request=context,
			username=email,
			password=password,
		)
		return user.get_jwt_token(context, cls)


@receiver(email_confirmed)
def update_user_email(sender, request, email_address, **kwargs):
	# Once the email address is confirmed, make new email_address primary.
	# This also sets user.email to the new email address.
	# email_address is an instance of allauth.account.models.EmailAddress
	email_address.set_as_primary()
	# Get rid of old email addresses
	EmailAddress.objects.filter(user=email_address.user).exclude(primary=True).delete()
