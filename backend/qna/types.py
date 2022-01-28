import graphene
from graphene_django import DjangoObjectType

from .models import Question, Answer


class QuestionType(DjangoObjectType):
    class Meta:
        model = Question
        fields = '__all__'

    count_answers = graphene.Int()

    def resolve_count_answers(self, info):
        if info.context.user.is_authenticated:
            return self.get_answers.count()


class AnswerType(DjangoObjectType):
    class Meta:
        model = Answer
        fields = '__all__'
