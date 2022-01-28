from django.contrib import admin

from .models import Test, TestAnswer


class TestAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'title', 'is_published', 'timestamp']


class TestAnswerAdmin(admin.ModelAdmin):
    list_display = ['student', 'test', 'timestamp']


admin.site.register(Test, TestAdmin)
admin.site.register(TestAnswer, TestAnswerAdmin)
