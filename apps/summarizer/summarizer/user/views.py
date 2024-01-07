from django.views.generic.base import RedirectView
from allauth.socialaccount.models import SocialLogin


class CustomSignupView(RedirectView):
	def get(self, request, *args, **kwargs):
		self.sociallogin = None
		data = request.session.get('socialaccount_sociallogin')
		if data:
			self.sociallogin = SocialLogin.deserialize(data)
		return super().get(request, *args, **kwargs)

	def get_redirect_url(self, *args, **kwargs):
		# Now you can access the request object with self.request
		print(self.sociallogin)
		return f'http://127.0.0.1:3000/user/social_signup?email={self.sociallogin.email_addresses[0]}'


class ResetPasswordView(RedirectView):
	def get_redirect_url(self, *args, **kwargs):
		print(self.kwargs['key'])
		print(self.kwargs['uidb36'])
		# RedirectView.as_view(url='https://www.djangoproject.com/')
		return 'https://www.djangoproject.com/'


class AccountConfirmEmailView(RedirectView):
	def get_redirect_url(self, *args, **kwargs):
		print(self.kwargs['key'])
		# RedirectView.as_view(url='https://www.djangoproject.com/')
		return 'https://www.djangoproject.com/'

