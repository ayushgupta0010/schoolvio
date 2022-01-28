from celery import shared_task
from django.contrib.auth import get_user_model
from django.db.models import Prefetch

from notification.models import Notification
from notification.tasks import send_notif, send_push_notification

User = get_user_model()


@shared_task
def post_notifier(sender_id, msg, post_id):
    user = User.objects.get(pk=sender_id)
    followers = user.followers.prefetch_related(Prefetch('fcm'))
    tokens = []
    for follower in followers:
        notif = Notification.objects.create(
            sender_id=sender_id,
            recipient=follower,
            message=msg,
            notifUrl=f'/post/{post_id}'
        )
        send_notif(notif) if follower.is_online() else tokens.append(follower.fcm.token)
    send_push_notification.delay(tokens, 'New Post', msg)
    return 'Done'


@shared_task
def like_notifier(sender_id, recipient_id, msg, post_id, is_online, token):
    notif = Notification.objects.create(
        sender_id=sender_id,
        recipient_id=recipient_id,
        message=msg,
        notifUrl=f'/post/{post_id}'
    )
    send_notif(notif) if is_online else send_push_notification.delay([token], '', msg)
    return 'Done'
