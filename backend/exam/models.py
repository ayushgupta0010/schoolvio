from django.db import models

from school.models import School
from student.models import Student
from teacher.models import Teacher
from utilities.class_section_list import CLASS_SECTION_LIST
from utilities.subjects_list import SUBJECT_LIST


class Exam(models.Model):
    name = models.CharField(max_length=100)
    isPublished = models.BooleanField(default=False)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='get_exams')

    def __str__(self):
        return f'{self.school} ~ {self.name}'


class Result(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='+')
    results = models.JSONField(blank=True, null=True)
    classSection = models.CharField(max_length=7, choices=CLASS_SECTION_LIST, verbose_name='Class & Section')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='get_teacher_results')

    class Meta:
        unique_together = ['exam', 'teacher']

    def __str__(self):
        return f'{self.teacher} ~ {self.exam}'


class StudentResult(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='+')
    result = models.JSONField(blank=True, null=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='get_student_results')

    class Meta:
        unique_together = ['exam', 'student']

    def __str__(self):
        return f'{self.student} ~ {self.exam}'


class Subject(models.Model):
    data = models.JSONField(blank=True, null=True)
    school = models.OneToOneField(School, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.school}'


class WrittenExam(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='+')
    files = models.TextField()
    publishDate = models.DateTimeField()
    duration = models.IntegerField()
    subject = models.CharField(max_length=18, choices=SUBJECT_LIST)
    classSection = models.CharField(max_length=7, choices=CLASS_SECTION_LIST, verbose_name='Class & Section')

    class Meta:
        unique_together = ['exam', 'subject', 'classSection', 'publishDate']

    def __str__(self):
        return f'{self.exam}'


class WrittenExamAnswer(models.Model):
    written_exam = models.ForeignKey(WrittenExam, on_delete=models.CASCADE, related_name='+')
    files = models.TextField(blank=True, null=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='get_written_exams_answers')

    class Meta:
        unique_together = ['student', 'written_exam']

    def __str__(self):
        return f'{self.student} ~ {self.written_exam}'
