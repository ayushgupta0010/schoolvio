import graphene
from django.utils import timezone
from graphene_django import DjangoObjectType

from .models import Exam, WrittenExam, WrittenExamAnswer, Result, Subject, StudentResult


class ExamType(DjangoObjectType):
    class Meta:
        model = Exam
        fields = '__all__'


class WrittenExamAnswerType(DjangoObjectType):
    class Meta:
        model = WrittenExamAnswer
        fields = '__all__'


class WrittenExamType(DjangoObjectType):
    class Meta:
        model = WrittenExam
        fields = '__all__'

    current_time = graphene.DateTime()
    uploaded_answer = graphene.Field(WrittenExamAnswerType)

    @staticmethod
    def resolve_current_time(self, info):
        if info.context.user.is_authenticated:
            return timezone.now()

    def resolve_uploaded_answer(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'student':
            return WrittenExamAnswer.objects.filter(student=user.student, written_exam=self).first()


class ResultType(DjangoObjectType):
    class Meta:
        model = Result
        fields = '__all__'


class SubjectType(DjangoObjectType):
    class Meta:
        model = Subject
        fields = '__all__'


class StudentResultType(DjangoObjectType):
    class Meta:
        model = StudentResult
        fields = '__all__'
