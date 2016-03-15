"""GRVTY URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog_urls'))
"""
from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView

admin.autodiscover()

urlpatterns = [
    url(r'^grvty/admin/', admin.site.urls),
    url(r'^accounts/', include('allauth.urls')),
]

if settings.DEBUG:
    import debug_toolbar
    from django.conf.urls.static import static
    urlpatterns.append(url(r'^grvty/debug-tool/', debug_toolbar.urls))
    urlpatterns += static(
            settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
        ) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# TODO: NEW APPS - ADD URLS
if settings.MAIN_APP:
    import MainAPP.urls
    urlpatterns += MainAPP.urls.urlpatterns

if settings.CMS_APP:
    import CMS.urls
    urlpatterns += CMS.urls.urlpatterns

if settings.BILLING_APP:
    import Billing.urls
    urlpatterns += Billing.urls.urlpatterns
