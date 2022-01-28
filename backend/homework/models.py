from django.db import models

from teacher.models import Teacher
from utilities.class_section_list import CLASS_SECTION_LIST
from utilities.subjects_list import SUBJECT_LIST


class Homework(models.Model):
    title = models.CharField(max_length=50)
    homework = models.TextField()
    subject = models.CharField(max_length=18, choices=SUBJECT_LIST)
    files = models.TextField(blank=True, null=True)
    classSection = models.CharField(max_length=7, choices=CLASS_SECTION_LIST, verbose_name='Class & Section')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='homeworks')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
