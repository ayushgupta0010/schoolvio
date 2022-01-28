from django.db import models

from teacher.models import ClassTeacher


class Attendance(models.Model):
    ct = models.ForeignKey(ClassTeacher, on_delete=models.CASCADE, related_name='+', verbose_name='Class Teacher')
    data = models.JSONField(blank=True, null=True)
    date = models.DateField()

    class Meta:
        unique_together = ['ct', 'date']

    def __str__(self):
        return f'{self.ct} ~ {self.date}'
