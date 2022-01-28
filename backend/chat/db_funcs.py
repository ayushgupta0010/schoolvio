from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from django.contrib.auth import get_user_model
from django.core.cache import cache

from notification.models import Notification
from notification.serializers import NotificationSerializer
from .models import Group, GroupUsersCache
from .serializers import ChatSerializer, ContactSerializer

User = get_user_model()

channel_layer = get_channel_layer()


def send_live_status_notifs(username, is_online, display_name):
    async_to_sync(channel_layer.group_send)(f'{display_name}', {
        'type': 'user_live_status',
        'username': username,
        'isOnline': is_online
    })


@database_sync_to_async
def set_live_status(username, is_online):
    cache.set(f'online_status_{username}', is_online, None)
    cache_query = f'contacts_for_{username}_excluding_class'
    contacts = cache.get(
        cache_query,
        User.objects.get(username=username).get_contacts.exclude(display_name__startswith='Class')
    )
    for contact in contacts:
        send_live_status_notifs(username, is_online, contact.display_name)
    cache.set(cache_query, contacts, 120)


@database_sync_to_async
def create_chat(sender, group, message, msg_type='text', files=None):
    data = {
        'sender': User.objects.get(username=sender).id, 'group': group,
        'message': message, 'msgType': msg_type, 'files': files
    }
    serializer = ChatSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
    return serializer.data


@database_sync_to_async
def get_chats_in_group(group):
    chats = Group.objects.get(uuid=group).get_chats.all().order_by('timestamp')
    serialized_data = ChatSerializer(chats, many=True).data
    return serialized_data


@database_sync_to_async
def get_contacts_for_user(username):
    cached_contacts = cache.get(f'contacts_for_{username}')
    if cached_contacts:
        return cached_contacts
    contacts = User.objects.get(username=username).get_contacts.all()
    serialized_data = ContactSerializer(contacts, many=True).data
    cache.set(f'contacts_for_{username}', serialized_data, 120)
    return serialized_data


@database_sync_to_async
def get_contacts_in_group(group):
    cache_query = f'contacts_in_group_{group}'
    cached_contacts = cache.get(cache_query)
    if cached_contacts:
        return cached_contacts
    group_cache = GroupUsersCache.objects.get(group__uuid=group)
    users = group_cache.users.split(',') if group_cache.users != '' else []
    cache.set(cache_query, users, 120)
    return users


@database_sync_to_async
def get_notifs_for_user(username):
    cached_notifs = cache.get(f'notification_{username}')
    if cached_notifs:
        return cached_notifs
    user = User.objects.get(username=username)
    notifs = user.get_notifs.all().order_by('-timestamp')
    serialized_data = NotificationSerializer(notifs, many=True).data
    cache.set(f'notification_{username}', serialized_data, 60)
    return serialized_data


@database_sync_to_async
def mark_notif_read(pk):
    Notification.objects.filter(pk=pk).update(isRead=True)
