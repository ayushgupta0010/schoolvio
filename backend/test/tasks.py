from celery import shared_task
from django.contrib.auth import get_user_model
from django.db.models import Prefetch

from notification.models import Notification
from notification.tasks import send_notif, send_push_notification
from student.models import Student

User = get_user_model()


@shared_task
def test_notifier(sender_id, school_id, recipient, msg):
    students = Student.objects.filter(
        school_id=school_id,
        classSection=recipient
    ).select_related('user').prefetch_related(Prefetch('user__fcm'))
    tokens = []
    for student in students:
        notif = Notification.objects.create(
            sender_id=sender_id,
            recipient=student.user,
            message=msg,
            notifUrl='/test'
        )
        send_notif(notif) if student.user.is_online() else tokens.append(student.user.fcm.token)
    send_push_notification.delay(tokens, 'New Test', msg)
    return 'Done'


@shared_task
def test_answer_notifier(sender_id, recipient_id, msg, is_online, token):
    notif = Notification.objects.create(
        sender_id=sender_id,
        recipient_id=recipient_id,
        message=msg,
        notifUrl='/test'
    )
    send_notif(notif) if is_online else send_push_notification.delay([token], 'New Test Answer', msg)
    return 'Done'
