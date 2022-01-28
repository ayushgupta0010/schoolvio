from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from user.models import UserFCMToken

User = get_user_model()


@receiver(post_save, sender=User)
def save_user_fcm_token(sender, instance, created, **kwargs):
    if created:
        UserFCMToken.objects.create(user=instance)
