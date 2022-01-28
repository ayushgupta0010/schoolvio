from django.core.cache import cache
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import StudentResult, Subject
from .tasks import exam_publish_notifier


@receiver(post_save, sender=StudentResult)
def trigger_exam_publish_notifier(sender, instance, created, **kwargs):
    if created:
        sent_by = instance.student.school.user.id
        recipient = instance.student.user.id
        msg = f'{instance.exam.name} results are out. Check out now!!!'
        is_online = instance.student.user.is_online()
        token = instance.student.user.fcm.token
        exam_publish_notifier.delay(sent_by, recipient, msg, is_online, token)


@receiver(post_save, sender=Subject)
def update_cache(sender, instance, created, **kwargs):
    cache.set(f'subjects_in_{instance.school}', instance, 86400)
