from MainAPP.generic import messages as msgs
from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.core import urlresolvers
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils.translation import ugettext as _ug


@login_required()
@transaction.atomic()
def WebFormView(request, environment, pk=None):
    environment.load_data(request.method, pk)
    instance = None
    if request.method == 'POST':
        new_instance, instance = formPost(request, environment)
        if new_instance is not None:
            return HttpResponseRedirect(urlresolvers.reverse(
                                        environment.redirect_urlname))
    elif request.method == 'PUT':
        new_instance, instance = formPut(request, environment)
        if new_instance is not None:
            return HttpResponseRedirect(urlresolvers.reverse(
                                        environment.redirect_urlname))
    elif request.method == 'GET':
        # Request the create/update form
        instance = formGet(request, environment)

    return render(
        request,
        environment.template,
        {'django_form': instance},
    )


# Function executed in case that the request received
#  by instance_push had a POST method
def formPost(request, environment=None):
    new_instance = instance_form = None
    permissions = environment.permissions
    if environment.pk is not None:
        msgs.generate_msg(request, msgs.RED, msgs.ERROR,
                          msgs.errors_list['title']['409'],
                          msgs.errors_list['body']['incorrect_method'])

    # handle creation of new instances
    elif environment.pk is None and (len(permissions) == 0 or
                                     request.user.has_perms(permissions)):
        instance_form = environment.serializer(data=request.POST)
        if instance_form.is_valid():
            new_instance = instance_form.save(user=request.user)
            msgs.generate_msg(request, msgs.GREEN, msgs.SUCCESS,
                              _ug('The creation was done successfully.'))
    else:
        msgs.generate_msg(request, msgs.RED, msgs.ERROR,
                          msgs.errors_list['title']['500'],
                          msgs.errors_list['body']['ticket'])
    return new_instance, instance_form


# Function executed in case that the request received
#  by instance_push had a PUT method
def formPut(request, environment=None):
    # handle update after new data has been posted
    new_instance = instance_form = None
    permissions = environment.permissions
    if environment.pk is not None and (len(permissions) == 0 or
                                       request.user.has_perms(permissions)):
        instance = environment.query
        instance_form = environment.serializer(
                            data=request.POST,
                            instance=instance)
        if instance_form.is_valid():
            new_instance = instance_form.save(user=request.user)
            msgs.generate_msg(request, msgs.GREEN, msgs.SUCCESS,
                              _ug('The changes have been saved.'))

    elif environment.pk is None:
        msgs.generate_msg(request, msgs.RED, msgs.ERROR,
                          msgs.errors_list['title']['409'],
                          msgs.errors_list['body']['incorrect_method'])
    else:
        msgs.generate_msg(request, msgs.RED, msgs.ERROR,
                          msgs.errors_list['title']['500'],
                          msgs.errors_list['body']['ticket'])
    return new_instance, instance_form


# Function executed in case that the request received
#  by instance_push had a GET method
def formGet(request, environment=None):
    instance = None
    permissions = environment.permissions
    if environment.pk is not None and (len(permissions) == 0 or
                                       request.user.has_perms(permissions)):
        new_instance = environment.query
        instance = environment.serializer(instance=new_instance)
    elif environment.pk is None and (len(permissions) == 0 or
                                     request.user.has_perms(permissions)):
        instance = environment.serializer()
    else:
        msgs.generate_msg(request, msgs.RED, msgs.ERROR,
                          msgs.errors_list['title']['500'],
                          msgs.errors_list['body']['ticket'])

    return instance
