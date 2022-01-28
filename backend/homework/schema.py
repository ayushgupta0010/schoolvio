import graphene
from django.core.cache import cache

from .models import Homework
from .types import HomeworkType


class Query(graphene.ObjectType):
    list_hw_by_class = graphene.List(HomeworkType)
    list_hw_by_teacher = graphene.List(HomeworkType)

    @staticmethod
    def resolve_list_hw_by_class(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'student':
            s = user.student
            cache_query = f'hw_for_{s.school}_{s.classSection}'
            cached_hws = cache.get(cache_query)
            if cached_hws:
                return cached_hws
            hws = Homework.objects.filter(teacher__school=s.school, classSection=s.classSection).order_by('-timestamp')
            cache.set(cache_query, hws, None)
            return hws

    @staticmethod
    def resolve_list_hw_by_teacher(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            cache_query = f'hw_by_{user}'
            cached_hws = cache.get(cache_query)
            if cached_hws:
                return cached_hws
            hws = user.teacher.homeworks.all().order_by('-timestamp')
            cache.set(cache_query, hws, None)
            return hws


class HomeworkCreateMutation(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        homework = graphene.String(required=True)
        subject = graphene.String(required=True)
        files = graphene.String()
        classSection = graphene.String(required=True)

    success = graphene.Boolean()
    hw = graphene.Field(HomeworkType)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            kwargs['teacher'] = user.teacher
            hw = Homework.objects.create(**kwargs)
            return HomeworkCreateMutation(success=True, hw=hw)


class HomeworkDeleteMutation(graphene.Mutation):
    class Arguments:
        pk = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, pk):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            Homework.objects.get(pk=pk).delete()
            return HomeworkDeleteMutation(success=True)


class Mutation(graphene.ObjectType):
    create_hw = HomeworkCreateMutation.Field()
    delete_hw = HomeworkDeleteMutation.Field()
