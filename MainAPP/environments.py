from MainAPP import models, forms, serializers


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
