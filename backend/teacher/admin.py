from django.contrib import admin

from .models import Teacher, ClassTeacher


class TeacherAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'contact', 'school']


class ClassTeacherAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'classSection']


admin.site.register(Teacher, TeacherAdmin)
admin.site.register(ClassTeacher, ClassTeacherAdmin)
