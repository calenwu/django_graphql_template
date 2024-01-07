import graphene
import graphql_jwt
import json

from django.conf import settings
from django.db import IntegrityError

from allauth.account import app_settings, signals
from allauth.account.admin import EmailAddress
from allauth.account.adapter import get_adapter
from allauth.account.forms import AddEmailForm, ResetPasswordForm, ResetPasswordKeyForm, UserTokenForm
from allauth.account.models import EmailConfirmationHMAC, EmailConfirmation
from allauth.account.utils import complete_signup, perform_login
from allauth.core import ratelimit
from allauth.socialaccount.forms import DisconnectForm
from allauth.socialaccount.models import SocialAccount, SocialLogin
from allauth.socialaccount.providers.google.views import oauth2_login as google_oauth2_login, oauth2_callback as google_oauth2_callback
from allauth.socialaccount.providers.twitter.views import oauth_login as twitter_oauth2_login, oauth_callback as twitter_oauth2_callback
from allauth.socialaccount.templatetags.socialaccount import provider_login_url
from allauth.utils import get_form_class

from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required

from core.exceptions import FormException
from core.utils import chanage_http_host, extract_uidb36_and_key, create_all_error
from user.models import User
from user.forms import SignUpForm, SignInForm, CustomSocialSignupForm


class Payload(graphene.ObjectType):
	email = graphene.String()
	exp = graphene.Int()
	origIat = graphene.String()


class OAuthSignupCallback(graphene.ObjectType):
	email = graphene.String()
	redirect = graphene.String()
	token = graphene.String()
	payload = graphene.Field(Payload)
	refresh_expires_in = graphene.Int()


class SocialAuthUrls(graphene.ObjectType):
	google = graphene.String()
	x = graphene.String()


class UserType(DjangoObjectType):
	class Meta:
		model = User
		fields = ['first_name', 'last_name', 'email', 'timezone', 'emailaddress_set', 'socialaccount_set']


class EmailadressType(DjangoObjectType):
	class Meta:
		model = EmailAddress
		fields = ['email', 'verified', 'primary']


class SocialAccountType(DjangoObjectType):
	email = graphene.String()

	class Meta:
		model = SocialAccount
		fields = ['uid', 'provider', 'email']

	def resolve_email(self, info):
		return self.extra_data['email']


class CreateUser(graphene.Mutation):
	"""
	https://github.com/pennersr/django-allauth/blob/f356138d8903d55755a5157e2992d5b40ba93205/allauth/account/views.py#L238
	https://github.com/flavors/django-graphql-jwt/blob/0debe4fbd5299e394ee253e6fa77e7a68b3236ba/graphql_jwt/decorators.py#L87
	https://github.com/flavors/django-graphql-jwt/blob/0debe4fbd5299e394ee253e6fa77e7a68b3236ba/graphql_jwt/decorators.py#L72
	"""

	class Arguments:
		email = graphene.String()
		password = graphene.String()

	token = graphene.String()
	payload = graphene.Field(Payload)
	refresh_expires_in = graphene.Int()

	@classmethod
	def mutate(cls, root, info, email: str, password: str):
		user_form = SignUpForm({
			'email': email,
			'password1': password
		})

		if user_form.is_valid():
			try:
				user = user_form.save(info.context)
				complete_signup(
					info.context,
					user,
					app_settings.EMAIL_VERIFICATION,
					settings.ACCOUNT_EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL
				)
				token, payload, expires_in = user.get_jwt_token(info.context, cls)
				# noinspection PyArgumentList
				return CreateUser(
					token=token,
					payload=Payload(
						email=payload['email'],
						exp=payload['exp'],
						origIat=payload['origIat']
					),
					refresh_expires_in=expires_in
				)
			except Exception as e:
				if User.objects.filter(email=email).exists():
					raise FormException(json.dumps({'email': ['A user with this email already exists']}))
				raise e
		raise FormException(json.dumps(user_form.errors.as_json()))


class SigninOrUp(graphene.Mutation):
	"""
	https://github.com/pennersr/django-allauth/blob/f356138d8903d55755a5157e2992d5b40ba93205/allauth/account/views.py#L238
	https://github.com/pennersr/django-allauth/blob/f356138d8903d55755a5157e2992d5b40ba93205/allauth/account/views.py#L238
	https://github.com/flavors/django-graphql-jwt/blob/0debe4fbd5299e394ee253e6fa77e7a68b3236ba/graphql_jwt/decorators.py#L87
	https://github.com/flavors/django-graphql-jwt/blob/0debe4fbd5299e394ee253e6fa77e7a68b3236ba/graphql_jwt/decorators.py#L72
	"""

	class Arguments:
		email = graphene.String()
		password = graphene.String()

	verified = graphene.Boolean()
	token = graphene.String()
	payload = graphene.Field(Payload)
	refresh_expires_in = graphene.Int()

	@classmethod
	def mutate(cls, root, info, email: str, password: str):
		user = User.objects.filter(email=email)
		if user.exists():
			user = user[0]
			user_form = SignInForm({
				'login': email,
				'password': password
			}, request=info.context)
			email_obj = EmailAddress.objects.filter(email=email)
			if email_obj.exists():
				email_obj = email_obj[0]
				if email_obj.verified:
					if not user_form.is_valid():
						raise FormException(json.dumps(user_form.errors.as_json()))
					token, payload, expires_in = User.get_user_jwt_token(email, password, info.context, cls)
					# noinspection PyArgumentList
					return SigninOrUp(
						verified=True,
						token=token,
						payload=Payload(
							email=payload['email'],
							exp=payload['exp'],
							origIat=payload['origIat']
						),
						refresh_expires_in=expires_in
					)
				else:
					social_account = SocialAccount.objects.filter(user=user)
					if social_account.exists():
						raise Exception(create_all_error(
							f'Your email is associated with a {social_account[0].provider} account. Please sign in with that.'
						))
			perform_login(
				info.context,
				User.objects.get(email=email),
				app_settings.EMAIL_VERIFICATION,
				settings.ACCOUNT_EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL
			)
		else:
			user_form = SignUpForm({
				'email': email,
				'password1': password
			})
			if user_form.is_valid():
				user = user_form.save(info.context)
				complete_signup(
					info.context,
					user,
					app_settings.EMAIL_VERIFICATION,
					settings.ACCOUNT_EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL
				)
			else:
				raise FormException(json.dumps(user_form.errors.as_json()))
		# noinspection PyArgumentList
		return SigninOrUp(
			verified=False,
			token='',
			payload=Payload(
				email='',
				exp=0,
				origIat=''
			),
			refresh_expires_in=0
		)


class ResetPassword(graphene.Mutation):
	"""
	https://github.com/pennersr/django-allauth/blob/f356138d8903d55755a5157e2992d5b40ba93205/allauth/account/views.py#L779C22-L779C22
	"""

	class Arguments:
		email = graphene.String()

	success = graphene.Boolean()

	@classmethod
	def mutate(cls, root, info, email: str):
		form = ResetPasswordForm({
			'email': email
		})
		if form.is_valid():
			r429 = ratelimit.consume_or_429(
				info.context,
				action='reset_password_email',
				key=email,
			)
			if r429:
				return r429
			form.save(info.context)
			# noinspection PyArgumentList
			return ResetPassword(success=True)
		else:
			raise FormException(json.dumps(form.errors.as_json()))


class ResetPasswordKey(graphene.Mutation):
	"""
	https://github.com/pennersr/django-allauth/blob/f356138d8903d55755a5157e2992d5b40ba93205/allauth/account/views.py#L822
	"""

	class Arguments:
		password = graphene.String()
		key = graphene.String()

	token = graphene.String()
	payload = graphene.Field(Payload)
	refresh_expires_in = graphene.Int()

	@classmethod
	def mutate(cls, root, info, password: str, key: str):
		# reset_url_key = 'set-password'
		user_token_form_class = get_form_class(
			app_settings.FORMS, 'user_token', UserTokenForm
		)
		uidb36, key = extract_uidb36_and_key(key)
		token_form = user_token_form_class(data={'uidb36': uidb36, 'key': key})
		if token_form.is_valid():
			reset_user = token_form._get_user(uidb36)
			form = ResetPasswordKeyForm({
				'password1': password,
				'password2': password
			},
				user=reset_user)
			if form.is_valid():
				form.save()

			adapter = get_adapter(info.context)

			# User successfully reset the password, clear any
			# possible cache entries for all email addresses.
			for email in reset_user.emailaddress_set.all():
				adapter._delete_login_attempts_cached_email(
					info.context, email=email.email
				)
			signals.password_reset.send(
				sender=reset_user.__class__,
				request=info.context,
				user=reset_user,
			)
			token, payload, expires_in = User.get_user_jwt_token(reset_user.email, password, info.context, cls)
			reset_user.revoke_previous_jwt_token(payload['origIat'])
			# noinspection PyArgumentList
			return ResetPasswordKey(
				token=token,
				payload=Payload(
					email=payload['email'],
					exp=payload['exp'],
					origIat=payload['origIat']
				),
				refresh_expires_in=expires_in
			)
		raise FormException(json.dumps(token_form.errors.as_json()))


class ChangeEmail(graphene.Mutation):
	"""
	https://github.com/pennersr/django-allauth/blob/main/allauth/account/forms.py#L277
	"""

	class Arguments:
		email = graphene.String()

	success = graphene.Boolean()

	@classmethod
	@login_required
	def mutate(cls, root, info, email: str):
		# info.context.user.add_email_address(info.context, email)
		form = AddEmailForm(data={
			'email': email
		}, user=info.context.user)
		if form.is_valid():
			form.save(info.context)
			# noinspection PyArgumentList
			return ChangeEmail(success=True)
		raise FormException(json.dumps(form.errors.as_json()))


class DeleteUnverifiedEmail(graphene.Mutation):
	class Arguments:
		email = graphene.String()

	success = graphene.Boolean()

	@classmethod
	@login_required
	def mutate(cls, root, info, email: str):
		# info.context.user.add_email_address(info.context, email)
		try:
			EmailAddress.objects.filter(user=info.context.user, email=email, primary=False, verified=False).delete()
			# noinspection PyArgumentList
			return DeleteUnverifiedEmail(success=True)
		except Exception as e:
			raise FormException(create_all_error(str(e)))


class AccountConfirmEmail(graphene.Mutation):
	"""
	https://github.com/pennersr/django-allauth/blob/main/allauth/account/views.py
	"""

	class Arguments:
		key = graphene.String()

	token = graphene.String()
	payload = graphene.Field(Payload)
	refresh_expires_in = graphene.Int()

	@classmethod
	def mutate(cls, root, info, key: str):
		# confirm_url_key = 'confirm_email'
		queryset = EmailConfirmation.objects.all_valid().select_related('email_address__user')
		email_confirmation = EmailConfirmationHMAC.from_key(key)
		if not email_confirmation:
			try:
				email_confirmation = queryset.get(key=key.lower())
			except EmailConfirmation.DoesNotExist:
				raise FormException(json.dumps({'key': ['Invalid key']}))
		confirmation = email_confirmation
		email_address = confirmation.confirm(info.context)
		if not email_address:
			raise FormException(json.dumps({'key': ['Invalid key']}))
		token, payload, expires_in = User.objects.get(email=email_address).get_jwt_token(info.context, cls)
		# noinspection PyArgumentList
		return AccountConfirmEmail(
			token=token,
			payload=Payload(
				email=payload['email'],
				exp=payload['exp'],
				origIat=payload['origIat']
			),
			refresh_expires_in=expires_in
		)


class DeleteAccount(graphene.Mutation):
	"""
	https://github.com/pennersr/django-allauth/blob/main/allauth/account/views.py
	"""

	class Arguments:
		key = graphene.String()

	success = graphene.Boolean()

	@classmethod
	@login_required
	def mutate(cls, root, info):
		# confirm_url_key = 'confirm_email'
		info.context.user.is_active = False
		info.context.user.save()
		# noinspection PyArgumentList
		return DeleteAccount(success=True)


class SignupSocial(graphene.Mutation):
	"""
	https://github.com/pennersr/django-allauth/blob/4c3b84a058b4bf3f9ea8fac72e053e90039bbebc/allauth/socialaccount/views.py#L26
	"""

	class Arguments:
		email = graphene.String()

	token = graphene.String()
	payload = graphene.Field(Payload)
	refresh_expires_in = graphene.Int()

	@classmethod
	def mutate(cls, root, info, email: str):
		# That is how its done in allauth
		sociallogin = SocialLogin.deserialize(info.context.session.get('socialaccount_sociallogin'))
		form = (CustomSocialSignupForm({'email': email}, sociallogin=sociallogin))
		if form.is_valid():
			try:
				user, res = form.try_save(info.context)
				# if not res:
				# 	raise FormException(json.dumps({'email': ['A user with this email already exists']}))
				token, payload, expires_in = user.get_jwt_token(info.context, cls)
				# noinspection PyArgumentList
				return SignupSocial(
					token=token,
					payload=Payload(
						email=payload['email'],
						exp=payload['exp'],
						origIat=payload['origIat']
					),
					refresh_expires_in=expires_in
				)
			except IntegrityError:
				raise Exception(
					create_all_error('You already have an account with this social account. Please try to sign in.')
				)
			except Exception as e:
				raise Exception(create_all_error(str(e)))
		raise FormException(json.dumps(form.errors.as_json()))


class DisconnectSocial(graphene.Mutation):
	"""
	https://github.com/pennersr/django-allauth/blob/4c3b84a058b4bf3f9ea8fac72e053e90039bbebc/allauth/socialaccount/views.py#L26
	"""

	class Arguments:
		uid = graphene.String()

	success = graphene.Boolean()

	@classmethod
	@login_required
	def mutate(cls, root, info, uid: str):
		form = DisconnectForm(data={
			'account': SocialAccount.objects.get(user=info.context.user, uid=uid)
		}, request=info.context)
		if form.is_valid():
			form.save()
			# noinspection PyArgumentList
			return DisconnectSocial(success=True)
		raise FormException(json.dumps(form.errors.as_json()))


class Query(graphene.ObjectType):
	"""
	Queries for the User model
	"""
	users = graphene.List(UserType)
	user_settings = graphene.Field(UserType)
	social_auth_urls = graphene.Field(SocialAuthUrls)
	google_signup = graphene.String()
	google_connect = graphene.String()
	google_signup_callback = graphene.Field(OAuthSignupCallback)
	twitter_signup = graphene.String()
	twitter_connect = graphene.String()
	twitter_signup_callback = graphene.Field(OAuthSignupCallback)

	# @login_required
	def resolve_users(root, info, **kwargs):
		from allauth.account.models import EmailAddress
		temp = EmailAddress.objects.all()[0]
		return temp
		return User.objects.all()

	@login_required
	def resolve_user_settings(root, info, **kwargs):
		return info.context.user

	def resolve_social_auth_urls(root, info, **kwargs):
		# noinspection PyArgumentList
		return SocialAuthUrls(
			google=f"{settings.BACKEND_URL}{provider_login_url({'request': info.context}, 'google')}",
			x=f"{settings.BACKEND_URL}{provider_login_url({'request': info.context}, 'twitter')}"
		)

	def resolve_google_connect(root, info, **kwargs):
		return provider_login_url({'request': info.context}, 'google', process='connect')

	def resolve_google_signup(root, info, **kwargs):
		return resolve_social_login(google_oauth2_login, info)

	def resolve_google_signup_callback(root, info, **kwargs):
		return resolve_social_callback(google_oauth2_callback, info, root)

	def resolve_twitter_connect(root, info, **kwargs):
		return provider_login_url({'request': info.context}, 'twitter', process='connect')

	def resolve_twitter_signup(root, info, **kwargs):
		return resolve_social_login(twitter_oauth2_login, info)

	def resolve_twitter_signup_callback(root, info, **kwargs):
		return resolve_social_callback(twitter_oauth2_callback, info, root)


class Mutation(graphene.ObjectType):
	"""
	Mutations for the User model
	"""
	token_auth = graphql_jwt.ObtainJSONWebToken.Field()
	verify_token = graphql_jwt.Verify.Field()
	refresh_token = graphql_jwt.Refresh.Field()
	create_user = CreateUser.Field()
	signin_or_up = SigninOrUp.Field()
	reset_password = ResetPassword.Field()
	reset_password_key = ResetPasswordKey.Field()
	change_email = ChangeEmail.Field()
	delete_unverified_email = DeleteUnverifiedEmail.Field()
	account_confirm_email = AccountConfirmEmail.Field()
	delete_account = DeleteAccount.Field()
	signup_social = SignupSocial.Field()
	disconnect_social = DisconnectSocial.Field()


def resolve_social_login(func, info):
	chanage_http_host(info)
	# noinspection PyArgumentList
	return func(info.context).url


def resolve_social_callback(func, info, root):
	chanage_http_host(info)
	temp = func(info.context)
	# Social Network Login Failure?
	if temp.content.decode('utf-8').find('Social Network Login Failure') != -1:
		raise ValueError('Social Network Login Failure')
	if temp.url == '/accounts/social/signup/':
		email_addresses = info.context.session.get('socialaccount_sociallogin').get('email_addresses')
		if email_addresses:
			email = email_addresses[0]['email']
		else:
			try:
				email = info.context.session.get('socialaccount_sociallogin').get('account').get('extra_data')['username']
			except Exception:
				email = 'email@gmail.com'
		# noinspection PyArgumentList
		return OAuthSignupCallback(email=email)
	elif temp.url == '/accounts/confirm-email/':
		# noinspection PyArgumentList
		return OAuthSignupCallback(redirect=temp.url)
	elif temp.url == '/accounts/social/connections/':
		# noinspection PyArgumentList
		return OAuthSignupCallback(redirect=temp.url)
	token, payload, expires_in = info.context.user.get_jwt_token(info.context, root)
	# noinspection PyArgumentList
	return OAuthSignupCallback(
		email='',
		redirect='' if temp.url == '/accounts/profile/' else temp.url,
		token=token,
		payload=Payload(
			email=payload['email'],
			exp=payload['exp'],
			origIat=payload['origIat']
		),
		refresh_expires_in=expires_in
	)