from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Group, GroupUsersCache, Contact, Chat
from .tasks import chat_notifier


@receiver(post_save, sender=Group)
def cache_group(sender, instance, created, **kwargs):
    if created:
        GroupUsersCache.objects.create(group=instance)


@receiver(post_save, sender=Contact)
def cache_user_in_group(sender, instance, created, **kwargs):
    if created:
        group_cache = GroupUsersCache.objects.get(group=instance.group)
        users_list = group_cache.users.split(',') if group_cache.users != '' else []
        users_list.append(instance.user.username)
        users = ','.join(set(users_list))
        group_cache.users = users
        group_cache.save()


@receiver(post_save, sender=Chat)
def trigger_chat_notifier(sender, instance, created, **kwargs):
    message = {
        'text': instance.message,
        'audio': 'audio',
        'document': 'document',
        'image': 'image',
        'video': 'video'
    }
    sent_by = f'{instance.sender}'
    recipient = str(instance.group)
    msg = message[instance.msgType]
    chat_notifier.delay(sent_by, recipient, msg)
