from django.db import models

from school.models import School


class Notice(models.Model):
    notice = models.TextField()
    timestamp = models.DateTimeField(auto_now=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='+')

    def __str__(self):
        return self.notice
