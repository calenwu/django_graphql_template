from django.conf import settings
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from user.views import ResetPasswordView, AccountConfirmEmailView, CustomSignupView

urlpatterns = i18n_patterns(
	path('calenwuadmintamade/', admin.site.urls),
	path('graphql', csrf_exempt(GraphQLView.as_view(graphiql=True))),
	# path('account/', include(('account.urls', 'account'), namespace='account')),
	re_path(
		r'^password/reset/key/(?P<uidb36>[0-9A-Za-z]+)-(?P<key>.+)/$',
		ResetPasswordView.as_view(),
		name='account_reset_password_from_key',
	),
	re_path(
		r'^confirm-email/(?P<key>[-:\w]+)/$',
		AccountConfirmEmailView.as_view(),
		name='account_confirm_email',
	),
	# path('accounts/social/signup/', CustomSignupView.as_view(), name='socialaccount_signup'),
	path('accounts/', include('allauth.urls')),
	prefix_default_language=False,
)

# handler400 = 'core.views.custom_bad_request_view'
# handler403 = 'core.views.custom_permission_denied_view'
# handler404 = 'core.views.custom_page_not_found_view'
# handler500 = 'core.views.custom_error_view'

if settings.DEBUG:
	import debug_toolbar
	from django.conf.urls.static import static
	from django.contrib.staticfiles.urls import staticfiles_urlpatterns

	# Serve static and media files from development server
	urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
	urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
	urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
