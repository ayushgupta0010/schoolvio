from graphene_django import DjangoObjectType

from .models import Chat, Contact


class ChatType(DjangoObjectType):
    class Meta:
        model = Chat
        fields = '__all__'


class ContactType(DjangoObjectType):
    class Meta:
        model = Contact
        fields = '__all__'
