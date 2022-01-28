from django.contrib import admin

from .models import School, Subscription


class SchoolAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'principal', 'board']


class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['school', 'subscription', 'start_date', 'end_date']


admin.site.register(School, SchoolAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
