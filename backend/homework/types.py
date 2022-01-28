from graphene_django import DjangoObjectType

from .models import Homework


class HomeworkType(DjangoObjectType):
    class Meta:
        model = Homework
        fields = '__all__'
