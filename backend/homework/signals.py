from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import Homework
from .tasks import hw_notifier


def get_hws_for_class(cls, school):
    return Homework.objects.filter(teacher__school=school, classSection=cls).order_by('-timestamp')


@receiver(post_save, sender=Homework)
def trigger_hw_notifier(sender, instance, created, **kwargs):
    if created:
        sent_by = instance.teacher.user.id
        school_id = instance.teacher.school.id
        recipient = instance.classSection
        msg = f'{instance.teacher} uploaded a homework in {instance.subject}.'
        hw_notifier.delay(sent_by, school_id, recipient, msg)

        # udpate cache
        hws_by_teacher = instance.teacher.homeworks.all().order_by('-timestamp')
        hws_for_class = get_hws_for_class(instance.classSection, instance.teacher.school)
        cache.set(f'hw_by_{instance.teacher}', hws_by_teacher, None)
        cache.set(f'hw_for_{instance.teacher.school}_{instance.classSection}', hws_for_class, None)


@receiver(post_delete, sender=Homework)
def update_hw_cache(sender, instance, **kwargs):
    hws_by_teacher = instance.teacher.homeworks.all().order_by('-timestamp')
    hws_for_class = get_hws_for_class(instance.classSection, instance.teacher.school)
    cache.set(f'hw_by_{instance.teacher}', hws_by_teacher, None)
    cache.set(f'hw_for_{instance.teacher.school}_{instance.classSection}', hws_for_class, None)
