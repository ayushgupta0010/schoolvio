from datetime import datetime, timedelta

from django.contrib.auth import get_user_model
from django.db import models

from utilities.board_list import BOARD_LIST
from utilities.subscription_info import SUBSCRIPTION_LIST, SUBSCRIPTION_DAYS

User = get_user_model()


class School(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    principal = models.CharField(max_length=50)
    name = models.CharField(max_length=50)
    address = models.TextField()
    contact = models.CharField(max_length=10)
    board = models.CharField(max_length=8, choices=BOARD_LIST)

    def __str__(self):
        return f'{self.user}'


class Subscription(models.Model):
    school = models.OneToOneField(School, on_delete=models.CASCADE)
    subscription = models.CharField(max_length=7, default='none', choices=SUBSCRIPTION_LIST)
    start_date = models.DateTimeField(auto_now=True)
    end_date = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f'{self.school} ~ {self.subscription}'

    def save(self, *args, **kwargs):
        self.end_date = datetime.now() + timedelta(days=SUBSCRIPTION_DAYS[self.subscription])
        super(Subscription, self).save(*args, **kwargs)
