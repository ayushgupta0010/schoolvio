from django.contrib.auth import get_user_model
from django.db import models

from school.models import School
from utilities.class_section_list import CLASS_SECTION_LIST
from utilities.qualification_list import QUALIFICATION_LIST

User = get_user_model()


class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    address = models.TextField()
    dob = models.DateField(verbose_name='Date of Birth')
    contact = models.CharField(max_length=10)
    startedTeaching = models.IntegerField(verbose_name='Started Teaching')
    joiningDate = models.DateField(verbose_name='Joining Date')
    qualification = models.CharField(max_length=7, choices=QUALIFICATION_LIST)
    about = models.TextField()
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='teachers')
    prev_school = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f'{self.user}'


class ClassTeacher(models.Model):
    teacher = models.OneToOneField(Teacher, on_delete=models.CASCADE, related_name='ct')
    classSection = models.CharField(
        max_length=7,
        blank=True,
        choices=CLASS_SECTION_LIST,
        verbose_name='Class & Section'
    )

    def __str__(self):
        return f'{self.teacher}'
