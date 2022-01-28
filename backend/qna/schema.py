import graphene
from django.contrib.auth import get_user_model
from django.core.cache import cache

from .models import Question, Answer
from .types import QuestionType, AnswerType

User = get_user_model()


class Query(graphene.ObjectType):
    que_detail = graphene.Field(QuestionType, id=graphene.ID(required=True))
    list_ques_all = graphene.List(QuestionType)
    list_ques_by = graphene.List(QuestionType, username=graphene.String(required=True))

    ans_detail = graphene.Field(AnswerType, id=graphene.ID(required=True))
    list_ans_by_qid = graphene.List(AnswerType, id=graphene.ID(required=True))
    list_ans_by_user = graphene.List(AnswerType, username=graphene.String(required=True))

    @staticmethod
    def resolve_que_detail(self, info, id):
        if info.context.user.is_authenticated:
            return Question.objects.filter(id=id).first()

    @staticmethod
    def resolve_list_ques_all(self, info):
        if info.context.user.is_authenticated:
            cache_query = 'all_questions'
            cached_ques = cache.get(cache_query)
            if cached_ques:
                return cached_ques
            ques = Question.objects.all().order_by('-timestamp')
            cache.set(cache_query, ques, None)
            return ques

    @staticmethod
    def resolve_list_ques_by(self, info, username):
        if info.context.user.is_authenticated:
            user = User.objects.get(username=username)
            cache_query = f'questions_by_{username}'
            cached_ques = cache.get(cache_query)
            if cached_ques:
                return cached_ques
            ques = user.questions.all().order_by('-timestamp')
            cache.set(cache_query, ques, None)
            return ques

    @staticmethod
    def resolve_ans_detail(self, info, id):
        if info.context.user.is_authenticated:
            cache_query = f'answer_{id}'
            cached_ans = cache.get(cache_query)
            if cached_ans:
                return cached_ans
            ans = Answer.objects.get(id=id)
            cache.set(cache_query, ans, None)
            return ans

    @staticmethod
    def resolve_list_ans_by_qid(self, info, id):
        if info.context.user.is_authenticated:
            cache_query = f'answer_for_question_{id}'
            cached_que = cache.get(cache_query)
            if cached_que:
                return cached_que
            q = Question.objects.get(id=id).get_answers.all().order_by('-timestamp')
            cache.set(cache_query, q, None)
            return q

    @staticmethod
    def resolve_list_ans_by_user(self, info, username):
        if info.context.user.is_authenticated:
            user = User.objects.get(username=username)
            cache_query = f'answers_by_{username}'
            cached_ans = cache.get(cache_query)
            if cached_ans:
                return cached_ans
            ans = user.answers.all().order_by('-timestamp')
            cache.set(cache_query, ans, None)
            return ans


class QuestionCreateMutation(graphene.Mutation):
    class Arguments:
        que = graphene.String(required=True)

    question = graphene.Field(QuestionType)

    @classmethod
    def mutate(cls, root, info, que):
        user = info.context.user
        if user.is_authenticated:
            q = Question.objects.create(user=user, question=que)
            return QuestionCreateMutation(question=q)


class AnswerCreateMutation(graphene.Mutation):
    class Arguments:
        que = graphene.ID(required=True)
        ans = graphene.String(required=True)

    question = graphene.Field(QuestionType)

    @classmethod
    def mutate(cls, root, info, que, ans):
        user = info.context.user
        if user.is_authenticated:
            a = Answer.objects.create(user=user, question_id=que, answer=ans)
            return AnswerCreateMutation(question=a.question)


class Mutation(graphene.ObjectType):
    create_question = QuestionCreateMutation.Field()
    create_answer = AnswerCreateMutation.Field()
