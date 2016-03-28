from . import models
from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm, ReadOnlyPasswordHashField

from django.utils.translation import ugettext as _ug


class CustomUserSignUpForm(UserCreationForm):
    password1 = forms.CharField(label=_ug('Password'), widget=forms.PasswordInput)
    password2 = forms.CharField(label=_ug('Password confirmation'), widget=forms.PasswordInput)

    class Meta(UserCreationForm.Meta):
        model = models.CustomUser
        fields = ('username', 'email',)

    def clean_username(self):
        username = self.cleaned_data['username']
        try:
            models.CustomUser.objects.get(username=username)
        except models.CustomUser.DoesNotExist:
            return username
        raise forms.ValidationError(_ug("A user with that username already exists."))

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')

        if not password1 or not password2 or password1 != password2:
            raise forms.ValidationError(_ug("The two password fields didn't match."))
        return password2

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user


class CustomUserChangeForm(UserChangeForm):

    fields = ('username', 'email', 'password', 'first_name', 'middle_name', 'last_name', 'mothers_name',
              'nickname', 'avatar', 'birthday', 'gender', 'last_login', 'edition_date', 'date_joined')

    class Meta(UserChangeForm.Meta):
        model = models.CustomUser

    def clean_username(self):
        username = self.cleaned_data['username']
        try:
            user = models.CustomUser.objects.get(username=username)
            if user.pk == self.instance.pk:
                return username
        except models.CustomUser.DoesNotExist:
            return username
        raise forms.ValidationError(_ug("A user with that username already exists."))
