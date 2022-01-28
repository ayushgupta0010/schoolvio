from django.contrib import admin

from .models import Chat, Group, GroupUsersCache, Contact


class ChatAdmin(admin.ModelAdmin):
    list_display = ['sender', 'group', 'timestamp']


class GroupAdmin(admin.ModelAdmin):
    list_display = ['uuid', 'name']


class GroupUsersCacheAdmin(admin.ModelAdmin):
    list_display = ['group', 'users']


class ContactAdmin(admin.ModelAdmin):
    list_display = ['group', 'user', 'display_name']


admin.site.register(Chat, ChatAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(GroupUsersCache, GroupUsersCacheAdmin)
admin.site.register(Contact, ContactAdmin)
