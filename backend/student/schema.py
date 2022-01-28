import graphene
from django.core.cache import cache

from chat.models import Contact, Group
from school.models import School
from .inputs import StudentCreateInput, StudentUpdateInput
from .models import Student
from .types import StudentType


def add_to_class_group(user, prev_cls, new_cls, school):
    if prev_cls == new_cls:
        return
    prev_class_section = prev_cls[2:].replace('_', '-')
    try:
        Contact.objects.get(user=user, display_name=f'Class {prev_class_section}').delete()
    except Contact.DoesNotExist:
        pass
    new_class_section = new_cls[2:].replace('_', '-')
    new_cls_group_name = f'{school}~{new_class_section}'
    group = Group.objects.get(name=new_cls_group_name)
    Contact.objects.get_or_create(group=group, user=user, display_name=f'Class {new_class_section}')


class Query(graphene.ObjectType):
    students_for_class_teacher = graphene.List(StudentType)

    @staticmethod
    def resolve_students_for_class_teacher(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            teacher = user.teacher
            cache_query = f'students_for_ct_{user}'
            cached_students = cache.get(cache_query)
            if cached_students:
                return cached_students
            students = Student.objects.filter(school=teacher.school, classSection=teacher.ct.classSection)
            cache.set(cache_query, students, 300)
            return students


class StudentCreateMutation(graphene.Mutation):
    class Arguments:
        student_data = StudentCreateInput(required=True)

    success = graphene.Boolean()
    error = graphene.String()

    @classmethod
    def mutate(cls, root, info, student_data):
        user = info.context.user
        if user.is_authenticated:
            try:
                school = School.objects.get(user__username=student_data['school'])
            except School.DoesNotExist:
                return StudentCreateMutation(success=False, error='School not found')
            student_data['school'] = school
            student_data['user'] = user
            Student.objects.create(**student_data)
            return StudentCreateMutation(success=True, error=None)


class StudentUpdateMutation(graphene.Mutation):
    class Arguments:
        student_data = StudentUpdateInput(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, student_data):
        if info.context.user.is_authenticated:
            student = Student.objects.get(user__username=student_data['username'])
            student.name = student_data['name'] if student_data['name'] else student.name
            student.fatherName = student_data['fatherName'] if student_data['fatherName'] else student.fatherName
            student.motherName = student_data['motherName'] if student_data['motherName'] else student.motherName
            student.admNo = student_data['admNo'] if student_data['admNo'] else student.admNo
            student.dob = student_data['dob'] if student_data['dob'] else student.dob
            student.address = student_data['address'] if student_data['address'] else student.address
            student.contact = student_data['contact'] if student_data['contact'] else student.contact
            student.rollNo = student_data['rollNo'] if student_data['rollNo'] else student.rollNo
            student.busNo = student_data['busNo'] if student_data['busNo'] else student.busNo
            student.goal = student_data['goal'] if student_data['goal'] else student.goal
            student.about = student_data['about'] if student_data['about'] else student.about
            if student_data['classSection']:
                add_to_class_group(student.user, student.classSection, student_data['classSection'], student.school)
                student.classSection = student_data['classSection']
            student.save()
            return StudentUpdateMutation(success=True)


class StudentUpdatePrevSchool(graphene.Mutation):
    class Arguments:
        school = graphene.String(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, school):
        user = info.context.user
        if user.is_authenticated and user.role == 'student':
            if user.student.prev_school != school:
                user.student.prev_school = school
                user.student.save()
            return StudentUpdatePrevSchool(success=True)


class StudentDeleteMutation(graphene.Mutation):
    class Arguments:
        username = graphene.String()

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, username):
        if info.context.user.is_authenticated:
            Student.objects.get(user__username=username).delete()
            return StudentDeleteMutation(success=True)


class Mutation(graphene.ObjectType):
    create_student = StudentCreateMutation.Field()
    update_student = StudentUpdateMutation.Field()
    update_student_prev_school = StudentUpdatePrevSchool.Field()
    delete_student = StudentDeleteMutation.Field()
