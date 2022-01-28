from django.contrib import admin

from .models import Student


class StudentAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'classSection', 'school']


admin.site.register(Student, StudentAdmin)
