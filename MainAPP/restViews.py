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
        self.environment.load_data('list', user=request.user, filters=request.data.get("filters", None))
        if len(self.environment.permissions) == 0 or request.user.has_perms(self.environment.permissions):
            serial = self.environment.serializer(self.environment.query, many=True, read_only=True)
            return Response(serial.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    @list_route(methods=['get'])
    def cached(self, request, format=None):
        self.environment.load_data('cached', user=request.user, filters=request.data.get("filters", None))
        if len(self.environment.permissions) == 0 or request.user.has_perms(self.environment.permissions):
            serial = self.environment.serializer(self.environment.query, many=True, read_only=True)
            return Response(serial.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
