from django.contrib.auth.models import AbstractUser
from django.core.cache import cache
from django.db import models

from utilities.role_list import ROLE_LIST


class User(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=9, choices=ROLE_LIST, blank=True, null=True)
    following = models.ManyToManyField('User', related_name='followers', blank=True)
    isProfileCompleted = models.BooleanField(default=False, verbose_name='Is profile completed?')
    isSchoolVerified = models.BooleanField(default=False, verbose_name='Is verified by school?')
    isSuspended = models.BooleanField(default=False, verbose_name='Is suspended?')
    reason = models.CharField(max_length=100, blank=True, verbose_name='Reason for suspension')
    photo = models.URLField(blank=True, null=True)

    def get_school(self):
        if self.role == 'student':
            return self.student.school
        elif self.role == 'teacher':
            return self.teacher.school
        else:
            return self.school

    def is_following(self, user):
        return self.following.filter(id=user.id) and True or False

    def is_online(self):
        return cache.get(f'online_status_{self}', False)

    def reset(self):
        self.role = None
        self.isProfileCompleted = False
        self.isSchoolVerified = False
        self.isSuspended = False
        self.reason = ''
        self.save()


class UserFCMToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='fcm')
    token = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f'{self.user}'
