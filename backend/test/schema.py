import graphene
from django.core.cache import cache

from .inputs import TestInput
from .models import Test, TestAnswer
from .types import TestType


class Query(graphene.ObjectType):
    test_by_id = graphene.Field(TestType, pk=graphene.ID(required=True))
    tests_by_teacher = graphene.List(TestType)
    tests_for_student = graphene.List(
        TestType,
        school=graphene.String(required=True),
        cls=graphene.String(required=True)
    )

    @staticmethod
    def resolve_test_by_id(self, info, pk):
        if info.context.user.is_authenticated:
            cache_query = f'test_{pk}'
            cached_test = cache.get(cache_query)
            if cached_test:
                return cached_test
            test = Test.objects.filter(pk=pk).first()
            if test.is_published:
                cache.set(cache_query, test, None)
            return test

    @staticmethod
    def resolve_tests_by_teacher(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            cache_query = f'tests_by_{user}'
            cached_tests = cache.get(cache_query)
            if cached_tests:
                return cached_tests
            tests = user.teacher.get_tests_given.all().order_by('-timestamp')
            cache.set(cache_query, tests, 30)
            return tests

    @staticmethod
    def resolve_tests_for_student(self, info, school, cls):
        user = info.context.user
        if user.is_authenticated and user.role == 'student':
            cache_query = f'tests_for_{school}_{cls}'
            cached_tests = cache.get(cache_query)
            if cached_tests:
                return cached_tests
            tests = Test.objects.filter(
                teacher__school__user__username=school,
                classSection=cls,
                is_published=True
            ).order_by('-timestamp')
            cache.set(cache_query, tests, 60)
            return tests


class TestCreateMutation(graphene.Mutation):
    class Arguments:
        data = TestInput(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, data):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            data['teacher'] = user.teacher
            Test.objects.create(**data)
            return TestCreateMutation(success=True)


class TestEditMutation(graphene.Mutation):
    class Arguments:
        pk = graphene.ID(required=True)
        data = TestInput(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, pk, data):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            Test.objects.filter(pk=pk).update(**data)
            return TestEditMutation(success=True)


class TestPublishMutation(graphene.Mutation):
    class Arguments:
        pk = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, pk):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            # don't use update() here because it won't trigger the notifier
            test = Test.objects.filter(pk=pk).first()
            test.is_published = True
            test.save()
            return TestPublishMutation(success=True)


class TestAnswerCreateMutation(graphene.Mutation):
    class Arguments:
        test = graphene.ID(required=True)
        answers = graphene.JSONString(required=True)
        marks = graphene.String(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, test, answers, marks):
        user = info.context.user
        if user.is_authenticated and user.role == 'student':
            TestAnswer.objects.create(student=user.student, test_id=test, answers=answers, marks=marks)
            return TestAnswerCreateMutation(success=True)


class Mutation(graphene.ObjectType):
    create_test = TestCreateMutation.Field()
    create_test_answer = TestAnswerCreateMutation.Field()
    edit_test = TestEditMutation.Field()
    publish_test = TestPublishMutation.Field()
