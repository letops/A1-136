from .architecture import routers
from . import views, restViews
from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView

admin.autodiscover()

restRouter = routers.CustomGenericRouter()
restRouter.register(r'CanvasInfo', restViews.CanvasInfo,
                    base_name='CanvasInfo')
restpatterns = restRouter.urls

normalRouter = routers.CustomGenericRouter()
normalRouter.register(r'poll', views.Poll, base_name='poll')
normalpatterns = normalRouter.urls

urlpatterns = [
    url(r'^$', views.home, name='home'),
    # url(r'^poll/$', views.poll, name='poll'),
    url(r'^canvas/$', views.canvas, name='canvas'),
    url(r'^share/$', views.share, name='share'),
    url(r'^rest/', include(restpatterns)),
    url(r'^', include(normalpatterns)),
]
