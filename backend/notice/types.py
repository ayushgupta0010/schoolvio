from graphene_django import DjangoObjectType

from .models import Notice


class NoticeType(DjangoObjectType):
    class Meta:
        model = Notice
        fields = '__all__'
