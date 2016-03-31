from . import models, forms, queries, serializers


class Environment:

    def __init__(self, section):
        self.section = section

        self.method = None
        self.serializer = None
        self.template = None
        self.redirect_urlname = None
        self.query = None
        self.permissions = []
        self.pk = None

    def load_data(self, method, pk, **kwargs):
        self.method = method
        self.pk = pk
        if self.section == 'Poll':
            if self.method == 'POST':
                self.serializer = forms.PollForm
                self.template = 'poll.html'
                self.redirect_urlname = 'canvas'
                self.permissions = []
                self.query = None


class RESTEnvironment(object):

    def __init__(self, section):
        self.section = section

        self.method = None  # Http method: GET, PATCH, POST, PUT, DELETE
        self.serializer = None  # Serializer from DjangoRestFramework used
        self.query = None  # The function used to recover the info from the DB
        self.filters = None  # The filters to be passed to the query
        self.permissions = []  # The list of permissions to execute the query

    def load_data(self, method, **kwargs):
        self.method = method
        self.filters = kwargs.get("filters", None)
        user = kwargs.get("user", None)

        if self.section == 'Canvas':
            self.template = 'canvas.html'

            if self.method == 'list':
                self.permissions = []

            if self.method == 'images':
                self.serializer = serializers.CanvasCategoriesSerializer
                self.permissions = []
                self.query = queries.CanvasCategories(user, self.filters)

            if self.method == 'cached':
                self.serializer = serializers.CanvasUserCacheSerializer
                self.permissions = []
                self.query = queries.CanvasUserCache(user, self.filters)

            if self.method == 'save':
                self.permissions = []
                self.query = queries.CanvasUserPositionSave(
                    user,
                    kwargs.get("imageId", None),
                    kwargs.get("row", None),
                    kwargs.get("column", None))

            if self.method == 'finish':
                self.permissions = []
                self.query = queries.CanvasFinish(user)

        if self.section == 'Poll':
            if self.method == 'list':
                self.serializer = serializers.PollSerializer
                self.permissions = []
                self.query = queries.Poll()
