from celery import shared_task

from chat.models import Contact
from notification.tasks import send_push_notification


@shared_task
def chat_notifier(sender, recipient, msg):
    contacts = Contact.objects.filter(group=recipient).exclude(user__username=sender)
    users = [contact.user for contact in contacts]
    tokens = [user.fcm.token for user in users if not user.is_online()]
    send_push_notification.delay(tokens, f'New message from {sender}', msg)
    return 'Done'
