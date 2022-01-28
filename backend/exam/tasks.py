from celery import shared_task
from django.contrib.auth import get_user_model

from notification.models import Notification
from notification.tasks import send_notif, send_push_notification
from student.models import Student
from .models import Result, StudentResult

User = get_user_model()


def get_student(student):
    return Student.objects.get(user__username=student)


def remove_subjects(subjects):
    return {k: v for k, v in subjects.items() if v != '-1'}


@shared_task
def exam_publisher(exam_id):
    results_to_publish = Result.objects.filter(exam_id=exam_id)
    for res in results_to_publish:
        results = res.results
        for student in results.keys():
            del results[student]['photo']
            del results[student]['examId']
            results[student]['subjects'] = remove_subjects(results[student]['subjects'])
            StudentResult.objects.create(student=get_student(student), exam_id=exam_id, result=results[student])


@shared_task
def exam_publish_notifier(sender_id, recipient_id, msg, is_online, token):
    notif = Notification.objects.create(
        sender_id=sender_id,
        recipient_id=recipient_id,
        message=msg,
        notifUrl='/results'
    )
    send_notif(notif) if is_online else send_push_notification.delay([token], 'Result out!!!', msg)
    return 'Done'
