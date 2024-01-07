from graphql_jwt.exceptions import PermissionDenied
from graphql_jwt.utils import get_http_authorization, jwt_decode
from user.models import User


class AuthCheckIat(object):
	def resolve(self, next, root, info, **args):
		context = info.context
		# Check if User.last_jwt_iat > token iat, raise error, stop evaluation
		if get_http_authorization(context) is not None:
			jwt_decoded = jwt_decode(get_http_authorization(context))
			user = User.objects.get(email=jwt_decoded['email'])
			iat = jwt_decoded['origIat']
			revoke_iat = user.get_revoke_jwt_token_iat()
			if revoke_iat and revoke_iat > iat:
				raise PermissionDenied('JWT expired')
		return next(root, info, **args)
