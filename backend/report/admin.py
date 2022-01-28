from django.contrib import admin

from .models import Report


class ReportAdmin(admin.ModelAdmin):
    list_display = ['user', 'queryType', 'query', 'status', 'timestamp']
    list_filter = ['queryType', 'status']


admin.site.register(Report, ReportAdmin)
