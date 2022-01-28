from celery import shared_task
from django.db.models import Prefetch

from notification.models import Notification
from notification.tasks import send_notif, send_push_notification
from school.models import School


@shared_task
def notice_notifier(sender_id, recipient, msg):
    school = School.objects.get(pk=recipient)
    students = school.students.select_related('user').prefetch_related(Prefetch('user__fcm'))
    teachers = school.teachers.select_related('user').prefetch_related(Prefetch('user__fcm'))
    tokens = []
    for student in students:
        notif = Notification.objects.create(
            sender_id=sender_id,
            recipient=student.user,
            message=msg,
            notifUrl='/notice'
        )
        send_notif(notif) if student.user.is_online() else tokens.append(student.user.fcm.token)

    for teacher in teachers:
        notif = Notification.objects.create(
            sender_id=sender_id,
            recipient=teacher.user,
            message=msg,
            notifUrl='/notice'
        )
        send_notif(notif) if teacher.user.is_online() else tokens.append(teacher.user.fcm.token)
    send_push_notification.delay(tokens, 'New Notice', msg)
    return 'Done'
