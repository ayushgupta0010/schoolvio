import graphene
from django.core.cache import cache
from django.utils import timezone

from .models import OnlineClass
from .types import OnlineClassType


class Query(graphene.ObjectType):
    online_classes_for_school = graphene.List(OnlineClassType)
    online_classes_for_teacher = graphene.List(OnlineClassType)
    online_classes_for_student = graphene.List(OnlineClassType)

    @staticmethod
    def resolve_online_classes_for_school(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'school':
            cache_query = f'online_classes_for_school_{user}'
            cached_classes = cache.get(cache_query)
            if cached_classes:
                return cached_classes
            classes = OnlineClass.objects.filter(
                teacher__school=user.school,
                startTime__date=timezone.now().today(),
                endTime__gt=timezone.now()
            )
            cache.set(cache_query, classes, 60)
            return classes

    @staticmethod
    def resolve_online_classes_for_teacher(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            cache_query = f'online_classes_for_teacher_{user}'
            cached_classes = cache.get(cache_query)
            if cached_classes:
                return cached_classes
            classes = user.teacher.get_online_classes.filter(endTime__gt=timezone.now())
            cache.set(cache_query, classes, 30)
            return classes

    @staticmethod
    def resolve_online_classes_for_student(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'student':
            s = user.student
            cache_query = f'online_classes_for_{s.school}_{s.classSection}'
            cached_classes = cache.get(cache_query)
            if cached_classes:
                return cached_classes
            c = OnlineClass.objects.filter(
                teacher__school=s.school,
                classSection=s.classSection,
                startTime__date=timezone.now().today(),
                endTime__gt=timezone.now(),
            )
            cache.set(cache_query, c, 30)
            return c


class OnlineClassCreateMutation(graphene.Mutation):
    class Arguments:
        startTime = graphene.DateTime(required=True)
        endTime = graphene.DateTime(required=True)
        link = graphene.String(required=True)
        passcode = graphene.String()
        subject = graphene.String(required=True)
        classSection = graphene.String(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            kwargs['teacher'] = user.teacher
            OnlineClass.objects.create(**kwargs)
            return OnlineClassCreateMutation(success=True)


class OnlineClassDeleteMutation(graphene.Mutation):
    class Arguments:
        pk = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, pk):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            OnlineClass.objects.get(pk=pk).delete()
            return OnlineClassDeleteMutation(success=True)


class Mutation(graphene.ObjectType):
    create_online_class = OnlineClassCreateMutation.Field()
    delete_online_class = OnlineClassDeleteMutation.Field()
