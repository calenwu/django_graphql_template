from django.apps import AppConfig
from django.db.utils import ProgrammingError


class UserConfig(AppConfig):
	name = 'user'

	def ready(self):
		import user.signals #noqa
		# from user.models import User
		# try:
		# 	for user in User.objects.all():
		# 		user.revoke_previous_jwt_token()
		# except ProgrammingError:
		# 	pass
		pass