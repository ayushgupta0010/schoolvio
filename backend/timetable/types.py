from graphene_django import DjangoObjectType

from .models import TimeTable


class TimeTableType(DjangoObjectType):
    class Meta:
        model = TimeTable
        fields = '__all__'
