from graphene_django import DjangoObjectType

from .models import Student


class StudentType(DjangoObjectType):
    class Meta:
        model = Student
        fields = '__all__'
