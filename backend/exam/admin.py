from django.contrib import admin

from .models import Exam, Result, Subject, StudentResult, WrittenExam, WrittenExamAnswer


class ExamAdmin(admin.ModelAdmin):
    list_display = ['name', 'isPublished', 'school']


class ResultAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'exam']


class StudentResultAdmin(admin.ModelAdmin):
    list_display = ['student', 'exam']


class WrittenExamAdmin(admin.ModelAdmin):
    list_display = ['exam', 'classSection', 'subject', 'publishDate']


class WrittenExamAnswerAdmin(admin.ModelAdmin):
    list_display = ['student', 'written_exam']


admin.site.register(Subject)
admin.site.register(Exam, ExamAdmin)
admin.site.register(Result, ResultAdmin)
admin.site.register(WrittenExam, WrittenExamAdmin)
admin.site.register(StudentResult, StudentResultAdmin)
admin.site.register(WrittenExamAnswer, WrittenExamAnswerAdmin)
