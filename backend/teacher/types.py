from graphene_django import DjangoObjectType

from .models import Teacher, ClassTeacher


class TeacherType(DjangoObjectType):
    class Meta:
        model = Teacher
        fields = '__all__'


class ClassTeacherType(DjangoObjectType):
    class Meta:
        model = ClassTeacher
        fields = '__all__'
