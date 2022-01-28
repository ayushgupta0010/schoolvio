import uuid

from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

MSG_TYPES = [
    ('audio', 'audio'),
    ('document', 'document'),
    ('image', 'image'),
    ('text', 'text'),
    ('video', 'video'),
]


class Group(models.Model):
    uuid = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return f'{self.uuid}'


class GroupUsersCache(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='+')
    users = models.TextField(blank=True, default='')

    def __str__(self):
        return f'{self.group}'


class Contact(models.Model):
    display_name = models.CharField(max_length=50)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='+')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='get_contacts')

    class Meta:
        unique_together = ['display_name', 'user']

    def __str__(self):
        return f'{self.group}'


class Chat(models.Model):
    message = models.TextField(blank=True)
    msgType = models.CharField(max_length=8, choices=MSG_TYPES, default='text', verbose_name='Message Type')
    files = models.JSONField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='+')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='get_chats')

    def __str__(self):
        return f'{self.sender}'
