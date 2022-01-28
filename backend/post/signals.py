from django.core.cache import cache
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Post, Like
from .tasks import post_notifier, like_notifier


@receiver(post_save, sender=Post)
def trigger_post_notifier(sender, instance, created, **kwargs):
    if created:
        sent_by = instance.user.id
        msg = f'{instance.user} added a new post.'
        post_notifier.delay(sent_by, msg, instance.id)

        # update cache
        posts = instance.user.posts.all().order_by('-timestamp')
        cache.set(f'posts_by_{instance.user}', posts, None)


@receiver(post_save, sender=Like)
def trigger_like_notifier(sender, instance, created, **kwargs):
    if created:
        sent_by = instance.user.id
        recipient = instance.post.user.id
        msg = f'{instance.user} liked your post.'
        is_online = instance.post.user.is_online()
        token = instance.post.user.fcm.token
        like_notifier.delay(sent_by, recipient, msg, instance.post.id, is_online, token)
