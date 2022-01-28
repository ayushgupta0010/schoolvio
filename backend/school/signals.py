from django.db.models.signals import post_save
from django.dispatch import receiver

from exam.models import Subject
from .models import School, Subscription


@receiver(post_save, sender=School)
def save_school_profile(sender, instance, created, **kwargs):
    if created:
        instance.user.role = 'school'
        instance.user.isProfileCompleted = True
        instance.user.isSchoolVerified = True
        instance.user.save()
        Subject.objects.create(school=instance)
        Subscription.objects.create(school=instance)
