from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import Student


@receiver(post_save, sender=Student)
def save_student_profile(sender, instance, created, **kwargs):
    if created:
        instance.user.role = 'student'
        instance.user.isProfileCompleted = True
        instance.user.save()

        # update cache
        cache_query = f'unverified_users_of_{instance.school}'
        unverified_users = cache.get(cache_query)
        if unverified_users:
            unverified_users.append(f'{instance}')
        else:
            unverified_users = [f'{instance}']
        cache.set(cache_query, unverified_users, None)


@receiver(post_delete, sender=Student)
def reset_user(sender, instance, **kwargs):
    instance.user.reset()
