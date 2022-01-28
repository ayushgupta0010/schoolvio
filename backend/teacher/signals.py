from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import Teacher, ClassTeacher


@receiver(post_save, sender=Teacher)
def save_teacher_profile(sender, instance, created, **kwargs):
    if created:
        instance.user.role = 'teacher'
        instance.user.isProfileCompleted = True
        instance.user.save()
        ClassTeacher.objects.create(teacher=instance)

        # update cache
        cache_query = f'unverified_users_of_{instance.school}'
        unverified_users = cache.get(cache_query)
        if unverified_users:
            unverified_users.append(f'{instance}')
        else:
            unverified_users = [f'{instance}']
        cache.set(cache_query, unverified_users, None)


@receiver(post_delete, sender=Teacher)
def reset_user(sender, instance, **kwargs):
    instance.user.reset()
