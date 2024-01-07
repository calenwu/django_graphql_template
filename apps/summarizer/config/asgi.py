"""
ASGI config.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""
import os
from django.core.asgi import get_asgi_application


django_asgi_app = get_asgi_application()


from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

# from chat import routing


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

application = ProtocolTypeRouter({
	# 'http': django_asgi_app,
	# 'websocket': AuthMiddlewareStack(
	# 	URLRouter(
	# 		routing.websocket_urlpatterns
	# 	)
	# ),
})
