import json

import requests
from asgiref.sync import async_to_sync
from celery import shared_task
from channels.layers import get_channel_layer
from django.contrib.auth import get_user_model

from core.settings import FCM_SERVER_KEY, FCM_URL, LOGO_URL
from .serializers import NotificationSerializer

User = get_user_model()

channel_layer = get_channel_layer()

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'key=' + FCM_SERVER_KEY
}


def send_notif(notif):
    serialized_data = NotificationSerializer(notif).data
    async_to_sync(channel_layer.group_send)(f'{notif.recipient}', {
        'type': 'new_notif',
        **serialized_data
    })


@shared_task
def send_push_notification(registration_ids, message_title, message_desc):
    payload = {
        'registration_ids': registration_ids,
        'priority': 'high',
        'notification': {'body': message_desc, 'title': message_title, 'image': LOGO_URL}
    }
    requests.post(FCM_URL, data=json.dumps(payload), headers=headers)
