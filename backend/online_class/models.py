from django.db import models

from teacher.models import Teacher
from utilities.class_section_list import CLASS_SECTION_LIST
from utilities.subjects_list import SUBJECT_LIST


class OnlineClass(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='get_online_classes')
    startTime = models.DateTimeField()
    endTime = models.DateTimeField()
    link = models.URLField()
    passcode = models.CharField(max_length=30, blank=True, null=True)
    subject = models.CharField(max_length=18, choices=SUBJECT_LIST)
    classSection = models.CharField(max_length=7, choices=CLASS_SECTION_LIST, verbose_name='Class & Section')

    def __str__(self):
        return f'{self.teacher} ~ {self.classSection}'
