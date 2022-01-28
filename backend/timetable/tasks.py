from celery import shared_task
from django.contrib.auth import get_user_model
from django.db.models import Prefetch

from chat.models import Contact, Group
from notification.models import Notification
from notification.tasks import send_notif, send_push_notification
from school.models import School

User = get_user_model()


def create_contact(group, user, display_name):
    Contact.objects.get_or_create(group=group, user=user, display_name=display_name)


@shared_task
def create_class_groups(school_username, timetable):
    if timetable is None:
        return
    school = User.objects.get(username=school_username)
    for cls in timetable.keys():
        ct = timetable[cls].get('classTeacher', 0)
        if ct != 0:
            del timetable[cls]['classTeacher']
            class_teacher = User.objects.get(username=ct)
            cls_name = f'{school}~{cls}'
            display_name = f'Class {cls}'
            group, _ = Group.objects.get_or_create(name=cls_name)
            create_contact(group, school, display_name)
            create_contact(group, class_teacher, display_name)
            for days in timetable[cls].keys():
                for periods in timetable[cls][days].keys():
                    tmp = timetable[cls][days][periods].get('teacher', 0)
                    if tmp != 0:
                        teacher = User.objects.get(username=tmp)
                        create_contact(group, teacher, display_name)


@shared_task
def timetable_notifier(sender_id, recipient, msg):
    school = School.objects.get(pk=recipient)
    students = school.students.select_related('user').prefetch_related(Prefetch('user__fcm'))
    teachers = school.teachers.select_related('user').prefetch_related(Prefetch('user__fcm'))
    tokens = []
    for student in students:
        notif = Notification.objects.create(
            sender_id=sender_id,
            recipient=student.user,
            message=msg,
            notifUrl='/school/timetable'
        )
        send_notif(notif) if student.user.is_online() else tokens.append(student.user.fcm.token)

    for teacher in teachers:
        notif = Notification.objects.create(
            sender_id=sender_id,
            recipient=teacher.user,
            message=msg,
            notifUrl='/school/timetable'
        )
        send_notif(notif) if teacher.user.is_online() else tokens.append(teacher.user.fcm.token)
    send_push_notification.delay(tokens, '', msg)
    return 'Done'
