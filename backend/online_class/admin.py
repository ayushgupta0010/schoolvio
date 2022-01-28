from django.contrib import admin

from .models import OnlineClass


class OnlineClassAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'classSection', 'subject', 'startTime', 'endTime']


admin.site.register(OnlineClass, OnlineClassAdmin)
