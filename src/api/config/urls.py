from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.utils.translation import ugettext_lazy as _
from django.views import defaults as default_views


urlpatterns = [
    # Django admin panel
    path(
        settings.ADMIN_URL,
        admin.site.urls
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += [
        path(
            r'400/',
            default_views.bad_request,
            kwargs={'exception': Exception('Bad Request')}
        ),
        path(
            r'403/',
            default_views.permission_denied,
            kwargs={'exception': Exception('Permission Denied')}
        ),
        path(
            r'404/',
            default_views.page_not_found,
            kwargs={'exception': Exception('Page not Found')}
        ),
        path(
            r'500/',
            default_views.server_error
        ),
    ]
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar
        urlpatterns = [
            path(r'__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns
