from django.contrib.auth.decorators import login_required
from django.core import urlresolvers
from django.http import HttpResponseRedirect
from django.shortcuts import render
from . import hardcode, queries

from .generic import apiViews
from .environments import RESTEnvironment
from rest_framework import status, authentication, permissions
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response


def html404(request):
    pass


class Poll(apiViews.EmptyAPIView):
    environment = RESTEnvironment('Poll')
    authentication_classes = (
        authentication.SessionAuthentication,
    )
    permission_classes = (permissions.IsAuthenticated, )

    def list(self, request, format=None):
        self.environment.load_data(
            'list',
            user=request.user)
        if len(self.environment.permissions) == 0 or \
                request.user.has_perms(self.environment.permissions):
            return render(
                request,
                self.environment.template,
            )
        else:
            return html404(request=request)

    @list_route(methods=['get'])
    def questions(self, request, format=None):
        self.environment.load_data(
            'questions',
            user=request.user)
        if len(self.environment.permissions) == 0 or \
                request.user.has_perms(self.environment.permissions):
            serial = self.environment.serializer(
                self.environment.query,
                many=True,
                read_only=True)
            return Response(serial.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    @list_route(methods=['post'])
    def radio(self, request, format=None):
        self.environment.load_data(
            'radio',
            user=request.user,
            questionId=request.data.get("questionId", None),
            answerId=request.data.get("answerId", None))
        if len(self.environment.permissions) == 0 or \
                request.user.has_perms(self.environment.permissions):
            if self.environment.query is not True:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    @list_route(methods=['post'])
    def priority(self, request, format=None):
        self.environment.load_data(
            'priority',
            user=request.user,
            questionId=request.data.get("questionId", None),
            answerId=request.data.get("answerId", None),
            weight=request.data.get("weight", None))
        if len(self.environment.permissions) == 0 or \
                request.user.has_perms(self.environment.permissions):
            if self.environment.query is not True:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class Canvas(apiViews.EmptyAPIView):
    environment = RESTEnvironment('Canvas')
    authentication_classes = (
        authentication.SessionAuthentication,
    )
    permission_classes = (permissions.IsAuthenticated, )

    def list(self, request, format=None):
        self.environment.load_data(
            'list',
            user=request.user)
        if len(self.environment.permissions) == 0 or \
                request.user.has_perms(self.environment.permissions):
            return render(
                request,
                self.environment.template,
            )
        else:
            return html404(request=request)

    @list_route(methods=['get', 'post'])
    def images(self, request, format=None):
        filters = request.data.get("filters", dict())
        self.environment.load_data(
            'images',
            user=request.user,
            filters=filters)
        if len(self.environment.permissions) == 0 or \
                request.user.has_perms(self.environment.permissions):
            serial = self.environment.serializer(
                self.environment.query,
                many=True,
                read_only=True,
                context={'size': filters.get("size", "200px")})
            return Response(serial.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    @list_route(methods=['get', 'post'])
    def cached(self, request, format=None):
        filters = request.data.get("filters", dict())
        self.environment.load_data(
            'cached',
            user=request.user,
            filters=filters)
        if len(self.environment.permissions) == 0 or \
                request.user.has_perms(self.environment.permissions):
            serial = self.environment.serializer(
                self.environment.query,
                many=True,
                read_only=True,
                context={'size': filters.get("size", "200px")})
            return Response(serial.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    @list_route(methods=['post'])
    def save(self, request, format=None):
        self.environment.load_data(
            'save',
            user=request.user,
            imageId=request.data.get("imageId", None),
            column=request.data.get("column", None),
            row=request.data.get("row", None))
        if len(self.environment.permissions) == 0 or \
                request.user.has_perms(self.environment.permissions):
            if self.environment.query is not True:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    @list_route(methods=['post'])
    def finish(self, request, format=None):
        self.environment.load_data(
            'finish',
            user=request.user)
        if len(self.environment.permissions) == 0 or \
                request.user.has_perms(self.environment.permissions):
            if self.environment.query is not True:
                return HttpResponseRedirect(urlresolvers.reverse('canvas-list'))
            return HttpResponseRedirect(urlresolvers.reverse('share'))
        else:
            return HttpResponseRedirect(urlresolvers.reverse('canvas-list'))


# Create your views here.
@login_required()
def home(request):
    step = request.user.step
    if step in (hardcode.STEP_UNKNOWN, hardcode.STEP_POLL):
        return HttpResponseRedirect(urlresolvers.reverse('poll-list'))
    elif step == hardcode.STEP_CANVAS:
        return HttpResponseRedirect(urlresolvers.reverse('canvas-list'))
    elif step == hardcode.STEP_DONE:
        return HttpResponseRedirect(urlresolvers.reverse('share'))
    else:
        return HttpResponseRedirect(urlresolvers.reverse('share'))


# @login_required()
# def poll(request):
#     if request.method == 'POST':
#         if queries.PollFinish(request.user) is True:
#             return HttpResponseRedirect(urlresolvers.reverse('canvas'))
#         msg.generate_msg(
#             request=request, state=msg.RED,
#             title=msg.errors_list['title']['500'],
#             body=msg.errors_list['body']['ticket'])
#     result = ''
#     return render(
#         request,
#         'poll.html',
#         {"result": result}
#     )


@login_required()
def share(request):
    image_render = queries.Share(user=request.user)

    return render(
        request,
        'share.html',
        {"image_render": image_render}
    )
