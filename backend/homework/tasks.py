from celery import shared_task
from django.db.models import Prefetch

from notification.models import Notification
from notification.tasks import send_notif, send_push_notification
from student.models import Student


@shared_task
def hw_notifier(sender_id, school_id, recipient, msg):
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
            notifUrl='/homework'
        )
        send_notif(notif) if student.user.is_online() else tokens.append(student.user.fcm.token)
    send_push_notification.delay(tokens, 'New Homework', msg)
    return 'Done'
