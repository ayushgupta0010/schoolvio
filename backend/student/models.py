from django.contrib.auth import get_user_model
from django.db import models

from school.models import School
from utilities.class_section_list import CLASS_SECTION_LIST
from utilities.goals_list import GOALS_LIST

User = get_user_model()


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    fatherName = models.CharField(max_length=50, verbose_name="Father's Name")
    motherName = models.CharField(max_length=50, verbose_name="Mother's Name")
    admNo = models.CharField(max_length=20, verbose_name='Admission No')
    dob = models.DateField(verbose_name='Date of Birth')
    address = models.TextField()
    contact = models.CharField(max_length=10)
    rollNo = models.IntegerField(verbose_name='Roll No')
    busNo = models.CharField(max_length=2, blank=True, null=True, default='')
    goal = models.CharField(max_length=18, choices=GOALS_LIST)
    about = models.TextField()
    classSection = models.CharField(max_length=7, choices=CLASS_SECTION_LIST, verbose_name='Class & Section')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='students')
    prev_school = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f'{self.user}'
