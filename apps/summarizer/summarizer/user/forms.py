from allauth.account.forms import SignupForm, LoginForm
from allauth.socialaccount.forms import SignupForm as SocialSignupForm
from user.models import User


class CustomSocialSignupForm(SocialSignupForm):
	pass


class SignInForm(LoginForm):
	# class Meta:
	# 	model = User
	# 	fields = ['login', 'password']
	pass


class SignUpForm(SignupForm):
	class Meta:
		model = User
		fields = ['email', 'password1']
