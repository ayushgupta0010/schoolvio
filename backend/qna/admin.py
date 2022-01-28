from django.contrib import admin

from .models import Question, Answer


class QuestionAdmin(admin.ModelAdmin):
    list_display = ['question', 'user', 'timestamp']


class AnswerAdmin(admin.ModelAdmin):
    list_display = ['question', 'answer', 'user', 'timestamp']


admin.site.register(Question, QuestionAdmin)
admin.site.register(Answer, AnswerAdmin)
