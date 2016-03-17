from . import models, forms, queries, serializers


class Environment:

    def __init__(self, section):
        self.section = section

        self.method = None
        self.model = None
        self.data_model = None
        self.serializer = None
        self.function = None
        self.template = None
        self.redirect_urlname = None
        self.query = None
        self.permissions = []

    def load_data(self, method, **kwargs):
        self.method = method
        if self.section == 'customuser':
            self.model = 'CustomUser'
            self.data_model = models.CustomUser
            if self.method == 'signup':
                self.serializer = forms.CustomUserSignUpForm
                self.template = 'signup.html'
                self.redirect_urlname = 'home'
                self.permissions = []
                self.query = None


class RESTEnvironment(object):

    def __init__(self, section):
        self.section = section

        self.method = None  # Http method: GET, PATCH, POST, PUT, DELETE
        self.serializer = None  # Serializer from DjangoRestFramework to be used
        self.query = None  # The function to be used to recover the info from the database
        self.filters = None  # The filters to be passed to the query
        self.permissions = []  # The list of permissions required to execute the query

    def load_data(self, method, **kwargs):
        self.method = method
        self.filters = kwargs.get("filters", None)
        user = kwargs.get("user", None)

        if self.section == 'CanvasInfo':
            if self.method == 'list':
                self.serializer = serializers.CanvasCategoriesSerializer
                self.permissions = []
                self.query = queries.CanvasCategories(user, self.filters)

            if self.method == 'cached':
                self.serializer = serializers.CanvasUserCacheSerializer
                self.permissions = []
                self.query = queries.CanvasUserCache(user, self.filters)
