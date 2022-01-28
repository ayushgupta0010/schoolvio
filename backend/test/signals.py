from django.core.cache import cache
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Test, TestAnswer
from .tasks import test_notifier, test_answer_notifier


@receiver(post_save, sender=Test)
def trigger_test_notifs(sender, instance, created, **kwargs):
    if instance.is_published:
        sent_by = instance.teacher.user.id
        school_id = instance.teacher.school.id
        recipient = instance.classSection
        msg = f'{instance.teacher} has uploaded a test in {instance.subject}.'
        test_notifier.delay(sent_by, school_id, recipient, msg)

        # update cache
        cache.set(f'test_{instance.id}', instance, None)


@receiver(post_save, sender=TestAnswer)
def trigger_test_answer_notifs(sender, instance, created, **kwargs):
    if created:
        sent_by = instance.student.user.id
        recipient = instance.test.teacher.user.id
        msg = f'{instance.student.name} took your {instance.test.subject} test.'
        is_online = instance.test.teacher.user.is_online()
        token = instance.test.teacher.user.fcm.token
        test_answer_notifier.delay(sent_by, recipient, msg, is_online, token)
