from . import queries
from .generic import apiViews
from .environments import RESTEnvironment
from rest_framework import status, authentication, permissions
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response


class CanvasInfo(apiViews.WebAPIView):
    environment = RESTEnvironment('CanvasInfo')
    authentication_classes = (
        authentication.SessionAuthentication,
    )
    permission_classes = (permissions.IsAuthenticated, )

    def list(self, request, format=None):
        filters = request.data.get("filters", dict())
        self.environment.load_data(
            'list',
            user=request.user,
            filters=filters
        )
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
