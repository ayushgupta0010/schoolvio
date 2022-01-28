from django.core.cache import cache
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Attendance


@receiver(post_save, sender=Attendance)
def update_cache(sender, instance, created, **kwargs):
    cache.set(f'attendance_by_{instance.ct}_on_{instance.date}', instance, 3600)
