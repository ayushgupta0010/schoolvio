from django.contrib import admin

from .models import Attendance


class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['ct', 'date']


admin.site.register(Attendance, AttendanceAdmin)
