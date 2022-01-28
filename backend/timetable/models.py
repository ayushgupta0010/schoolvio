from django.db import models

from school.models import School


class TimeTable(models.Model):
    detail = models.JSONField(blank=True, null=True)
    school = models.OneToOneField(School, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.school}'
