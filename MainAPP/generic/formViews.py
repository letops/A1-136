from MainAPP.generic import messages as msgs
from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.core import urlresolvers
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils.translation import ugettext as _ug


# FIXME: Fix this file to be compatible with the new Environments


@login_required()
@transaction.atomic()
def object_push(request, environment, pk=None):
    template_vars = dict()
    environment.load_data('', kwargs={'id': pk})
    instance = None
    if request.method == 'POST':
        new_instance, instance = push_post(request, pk, environment)
        if new_instance is not None:
            # At this point, create/update has succeeded
            if pk is not None:
                msgs.generate_msg(request, msgs.GREEN, msgs.SUCCESS,
                                  _ug('The changes have been saved.'))
            else:
                msgs.generate_msg(request, msgs.GREEN, msgs.SUCCESS,
                                  _ug('The creation was done successfully.'))
            return HttpResponseRedirect(urlresolvers.reverse(environment.redirect_urlname))
    elif request.method == 'GET':
        #Request the create/update form
        instance = push_get(request, pk, environment)

    formas = {'django_form': instance}
    return render_to_response(
        environment.template,
        formas,
        RequestContext(
            request,
            template_vars
        )
    )


# Function executed in case that the request received
#  by instance_push had a POST method
def push_post(request, pk=None, env=None):
    # handle update after new data has been posted
    new_instance = instance_form = None
    if pk is not None and request.user.has_perm('%s.change_%s' % (env.data_model._meta.app_label, env.model.lower())):
        instance = env.data_model.objects.get(pk=pk)
        instance_form = env.serializer(data=request.POST, instance=instance)

        if instance_form.is_valid():
            new_instance = instance_form.save(user=request.user)

    # handle creation of new instances
    elif pk is None and request.user.has_perm('%s.add_%s' % (env.data_model._meta.app_label, env.model.lower())):
        instance_form = env.serializer(data=request.POST)
        if instance_form.is_valid():
            new_instance = instance_form.save(user=request.user)
    else:
        msgs.generate_msg(request, msgs.RED, msgs.ERROR, _ug('A problem occurred. The action could not be completed.'))
    return new_instance, instance_form


# Function executed in case that the request received
#  by instance_push had a GET method
def push_get(request, pk=None, env=None):
    instance = None
    if pk is not None and request.user.has_perm('%s.change_%s' % (env.data_model._meta.app_label, env.model.lower())):
        new_instance = env.data_model.objects.get(pk=pk)
        instance = env.serializer(instance=new_instance)
    elif pk is None and request.user.has_perm('%s.add_%s' % (env.data_model._meta.app_label, env.model.lower())):
        instance = env.serializer()
    else:
        msgs.generate_msg(request, msgs.RED, msgs.ERROR, _ug('A problem occurred. The action could not be completed.'))

    return instance
