from django.contrib import admin

from .models import Notification


class NotificationAdmin(admin.ModelAdmin):
    list_display = ['sender', 'recipient', 'message', 'timestamp']


admin.site.register(Notification, NotificationAdmin)
