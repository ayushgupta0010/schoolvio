from django.contrib import admin

from .models import Notice


class NoticeAdmin(admin.ModelAdmin):
    list_display = ['notice', 'school', 'timestamp']


admin.site.register(Notice, NoticeAdmin)
