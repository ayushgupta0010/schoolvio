from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer

from .models import Chat, Contact

User = get_user_model()


def get_user_info(username):
    user = User.objects.get(username=username)
    is_online = user.is_online()
    photo = user.photo
    return photo, is_online


class ChatSerializer(ModelSerializer):
    class Meta:
        model = Chat
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(ChatSerializer, self).to_representation(instance)
        rep['group'] = str(instance.group)
        rep['photo'] = instance.sender.photo
        rep['sender'] = instance.sender.username
        return rep


class ContactSerializer(ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

    def to_representation(self, instance):
        rep = super(ContactSerializer, self).to_representation(instance)
        rep['group'] = str(instance.group)
        if instance.display_name.startswith('Class'):
            rep['photo'] = instance.user.get_school().user.photo
        else:
            rep['photo'], rep['isOnline'] = get_user_info(instance.display_name)
        rep['user'] = instance.user.username
        rep['last'] = ChatSerializer(instance.group.get_chats.order_by('-timestamp').first()).data
        return rep
