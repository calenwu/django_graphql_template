import json
import re
from django.conf import settings


def create_all_error(message: str) -> str:
	return json.dumps(json.dumps({
		'__all__': [{
			'message': message,
			'code': ''
		}]
	}))


def extract_uidb36_and_key(input_string: str) -> tuple[str, str]:
	match = re.search(r'(?P<uidb36>[0-9A-Za-z]+)-(?P<key>.+)$', input_string)
	if match:
		uidb36 = match.group('uidb36')
		key = match.group('key')
		return uidb36, key
	else:
		return None, None


def chanage_http_host(info):
	if settings.USE_X_FORWARDED_HOST and ('HTTP_X_FORWARDED_HOST' in info.context.META):
		info.context.META['HTTP_X_FORWARDED_HOST'] = settings.FRONTEND_URL
	elif 'HTTP_HOST' in info.context.META:
		info.context.META['HTTP_HOST'] = settings.FRONTEND_URL.replace('https://', '').replace('http://', '')
	else:
		# Reconstruct the host using the algorithm from PEP 333.
		info.context.META['SERVER_NAME'] = settings.FRONTEND_URL
