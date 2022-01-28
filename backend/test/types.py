import graphene
from graphene_django import DjangoObjectType

from .models import Test, TestAnswer


class TestAnswerType(DjangoObjectType):
    class Meta:
        model = TestAnswer
        fields = '__all__'


class TestType(DjangoObjectType):
    class Meta:
        model = Test
        fields = '__all__'

    get_answer_by_current_user = graphene.Field(TestAnswerType)
    is_test_taken = graphene.Boolean()

    @staticmethod
    def resolve_get_answer_by_current_user(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'student':
            return TestAnswer.objects.filter(test=self, student=user.student).first()

    @staticmethod
    def resolve_is_test_taken(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'student':
            return TestAnswer.objects.filter(test=self, student=user.student) or False
