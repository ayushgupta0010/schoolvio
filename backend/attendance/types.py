from graphene_django import DjangoObjectType

from .models import Attendance


class AttendanceType(DjangoObjectType):
    class Meta:
        model = Attendance
        fields = '__all__'
