from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Notification(models.Model):
    notifUrl = models.CharField(max_length=100)
    message = models.CharField(max_length=50)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifs')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='get_notifs')
    isRead = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender}'
