import graphene
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.contrib.auth import get_user_model

from .models import Contact, Group
from .serializers import ContactSerializer
from .types import ContactType

User = get_user_model()


class Query(graphene.ObjectType):
    group_contacts = graphene.List(ContactType, group=graphene.String(required=True))

    @staticmethod
    def resolve_group_contacts(self, info, group):
        if info.context.user.is_authenticated:
            return Contact.objects.filter(group=group)


class ContactCreateMutation(graphene.Mutation):
    class Arguments:
        user = graphene.String(required=True)
        group_name = graphene.String(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, user, group_name):
        me = info.context.user
        if me.is_authenticated:
            group, created = Group.objects.get_or_create(name=group_name)
            user = User.objects.get(username=user)
            contact1, _ = Contact.objects.get_or_create(group=group, user=me, display_name=user.username)
            contact2, _ = Contact.objects.get_or_create(group=group, user=user, display_name=me.username)
            if created:
                channel_layer = get_channel_layer()
                serialized_data = ContactSerializer(contact2).data
                serialized_data['group'] = str(serialized_data['group'])
                async_to_sync(channel_layer.group_send)(f'{contact2.user}', {
                    'type': 'new_contact',
                    **serialized_data
                })
            return ContactCreateMutation(success=True)


class Mutation(graphene.ObjectType):
    create_contact = ContactCreateMutation.Field()
