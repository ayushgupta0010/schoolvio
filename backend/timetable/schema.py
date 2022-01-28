import graphene
from django.core.cache import cache

from .models import TimeTable
from .types import TimeTableType


class Query(graphene.ObjectType):
    timetable = graphene.Field(TimeTableType, school=graphene.String(required=True))

    @staticmethod
    def resolve_timetable(self, info, school):
        user = info.context.user
        if user.is_authenticated:
            cache_query = f'timetable_for_{school}'
            cached_timetable = cache.get(cache_query)
            if cached_timetable:
                return cached_timetable
            timetable = TimeTable.objects.get(school__user__username=school)
            cache.set(cache_query, timetable, None)
            return timetable


class TimeTableMutation(graphene.Mutation):
    class Arguments:
        data = graphene.JSONString(required=True)

    timetable = graphene.Field(TimeTableType)

    @classmethod
    def mutate(cls, root, info, data):
        user = info.context.user
        if user.is_authenticated and user.role == 'school':
            timetable = user.school.timetable
            timetable.detail = data
            timetable.save()
            return TimeTableMutation(timetable=timetable)


class Mutation(graphene.ObjectType):
    update_timetable = TimeTableMutation.Field()
