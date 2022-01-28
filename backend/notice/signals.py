from django.core.cache import cache
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Notice
from .tasks import notice_notifier


@receiver(post_save, sender=Notice)
def trigger_notice_notifier(sender, instance, created, **kwargs):
    if created:
        sent_by = instance.school.user.id
        recipient = instance.school.id
        msg = f'{instance.school} uploaded a notice.'
        notice_notifier.delay(sent_by, recipient, msg)

        # update cache
        notices = Notice.objects.filter(school=instance.school).order_by('-timestamp')
        cache.set(f'notices_for_{instance.school}', notices, None)
