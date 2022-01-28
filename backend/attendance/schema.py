import graphene
from django.core.cache import cache

from .models import Attendance
from .types import AttendanceType


class Query(graphene.ObjectType):
    attendance_for_date = graphene.Field(AttendanceType, date=graphene.Date(required=True))

    @staticmethod
    def resolve_attendance_for_date(self, info, date):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            cache_query = f'attendance_by_{user}_on_{date}'
            cached_attendance = cache.get(cache_query)
            if cached_attendance:
                return cached_attendance
            attendance, _ = Attendance.objects.get_or_create(ct=user.teacher.ct, date=date)
            cache.set(cache_query, attendance, 3600)
            return attendance


class AttendanceEditMutation(graphene.Mutation):
    class Arguments:
        pk = graphene.ID(required=True)
        data = graphene.JSONString()

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, pk, data):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            att = Attendance.objects.get(pk=pk)
            att.data = data
            att.save()
            return AttendanceEditMutation(success=True)


class Mutation(graphene.ObjectType):
    edit_attendance = AttendanceEditMutation.Field()
