from django.db import models

from student.models import Student
from teacher.models import Teacher
from utilities.class_section_list import CLASS_SECTION_LIST
from utilities.subjects_list import SUBJECT_LIST


class Test(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='get_tests_given')
    title = models.CharField(max_length=100)
    duration = models.IntegerField()
    classSection = models.CharField(max_length=7, choices=CLASS_SECTION_LIST, verbose_name='Class & Section')
    subject = models.CharField(max_length=18, choices=SUBJECT_LIST)
    questions = models.JSONField()
    is_published = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.teacher} ~ {self.id}'


class TestAnswer(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='get_test_answers')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='get_tests_taken')
    answers = models.JSONField()
    marks = models.CharField(max_length=10, blank=True, default='')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['student', 'test']

    def __str__(self):
        return f'{self.student}'
