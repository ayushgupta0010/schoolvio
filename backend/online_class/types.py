from graphene_django import DjangoObjectType

from .models import OnlineClass


class OnlineClassType(DjangoObjectType):
    class Meta:
        model = OnlineClass
        fields = '__all__'
