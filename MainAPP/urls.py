from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView
from . import views

admin.autodiscover()

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^poll/$', views.poll, name='poll'),
    url(r'^canvas/$', views.canvas, name='canvas'),
    url(r'^share/$', views.share, name='share'),
]
