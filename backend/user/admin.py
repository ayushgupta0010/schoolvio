from django.apps import apps
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group

from .models import User, UserFCMToken

app = apps.get_app_config('graphql_auth')

for model_name, model in app.models.items():
    admin.site.register(model)


class UserFCMTokenAdmin(admin.ModelAdmin):
    list_display = ['user', 'token']


class MyUserAdmin(UserAdmin):
    fieldsets = ((None, {
        'fields': (
            'username',
            'email',
            'photo',
            'role',
            'isProfileCompleted',
            'isSchoolVerified',
            'isSuspended',
            'reason',
            'following',
            'date_joined'
        )
    }),)
    add_fieldsets = ((None, {
        'fields': ('username', 'email', 'password1', 'password2')
    }),)
    list_display = ['username', 'email', 'role', 'isProfileCompleted', 'isSchoolVerified', 'isSuspended']
    list_filter = ['role', 'isProfileCompleted', 'isSchoolVerified', 'isSuspended']


admin.site.unregister(Group)
admin.site.register(User, MyUserAdmin)
admin.site.register(UserFCMToken, UserFCMTokenAdmin)
