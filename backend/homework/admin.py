from django.contrib import admin

from .models import Homework


class HomeworkAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'homework', 'subject', 'classSection']


admin.site.register(Homework, HomeworkAdmin)
