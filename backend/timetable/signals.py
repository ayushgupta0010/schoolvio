from django.core.cache import cache
from django.db.models.signals import post_save
from django.dispatch import receiver

from school.models import School
from teacher.tasks import check_class_teachers
from .models import TimeTable
from .tasks import timetable_notifier, create_class_groups


@receiver(post_save, sender=School)
def save_timtable(sender, instance, created, **kwargs):
    if created:
        TimeTable.objects.get_or_create(school=instance)


@receiver(post_save, sender=TimeTable)
def trigger_timetable_notifier(sender, instance, created, **kwargs):
    sent_by = instance.school.user.id
    recipient = instance.school.id
    msg = 'Timetable updated. Check for any changes.'
    timetable_notifier.delay(sent_by, recipient, msg)

    cache.set(f'timetable_for_{instance.school}', instance, None)
    create_class_groups.delay(f'{instance.school}', instance.detail)
    check_class_teachers.delay(instance.detail)
