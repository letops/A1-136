from django.contrib import admin
from django.contrib.auth.models import Permission
from django.contrib.auth.admin import UserAdmin
from MainAPP import models, forms

admin.site.register(Permission)
admin.site.register(models.Category)
admin.site.register(models.Cluster)
admin.site.register(models.IsometricImage)
admin.site.register(models.Question)
admin.site.register(models.Answer)
admin.site.register(models.Selection)
admin.site.register(models.Position)
admin.site.register(models.Render)


@admin.register(models.CustomUser)
class CustomUserAdmin(UserAdmin):
    form = forms.CustomUserChangeForm
    add_form = forms.CustomUserSignUpForm
    readonly_fields = ('last_login', 'edition_date', 'date_joined')

    list_display = ('username', 'nickname', 'email', 'is_staff',
                    'is_superuser', 'step')
    list_filter = ('is_superuser', 'is_staff', 'is_active', 'step')

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password', 'first_name',
                           'middle_name', 'last_name', 'mothers_name',
                           'nickname', 'avatar', 'birthday', 'gender', 'step',
                           'last_login', 'edition_date', 'date_joined')}),
        ('Permissions', {'fields': ('is_active', 'is_superuser', 'is_staff')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email',  'password1', 'password2',
                       'nickname', 'avatar', 'birthday', 'gender', )
        }),
        ('Permissions', {'fields': ('is_active', 'is_superuser', 'is_staff')}),
    )

    search_fields = ('email', 'username', 'nickname', 'step')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)
