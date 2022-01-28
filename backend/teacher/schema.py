import graphene
from django.core.cache import cache

from school.models import School
from .inputs import TeacherCreateInput, TeacherUpdateInput
from .models import Teacher
from .types import TeacherType


class Query(graphene.ObjectType):
    teachers_list = graphene.List(TeacherType, school=graphene.String(required=True))

    @staticmethod
    def resolve_teachers_list(self, info, school):
        if info.context.user.is_authenticated:
            cache_query = f'teachers_list_for_{school}'
            cached_teachers = cache.get(cache_query)
            if cached_teachers:
                return cached_teachers
            teachers = Teacher.objects.filter(school__user__username=school)
            cache.set(cache_query, teachers, 300)
            return teachers


class TeacherCreateMutation(graphene.Mutation):
    class Arguments:
        teacher_data = TeacherCreateInput(required=True)

    success = graphene.Boolean()
    error = graphene.String()

    @classmethod
    def mutate(cls, root, info, teacher_data):
        user = info.context.user
        if user.is_authenticated:
            try:
                school = School.objects.get(user__username=teacher_data['school'])
            except School.DoesNotExist:
                return TeacherCreateMutation(success=False, error='School not found')
            teacher_data['school'] = school
            teacher_data['user'] = user
            Teacher.objects.create(**teacher_data)
            return TeacherCreateMutation(success=True, error=None)


class TeacherUpdateMutation(graphene.Mutation):
    class Arguments:
        teacher_data = TeacherUpdateInput(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, teacher_data):
        if info.context.user.is_authenticated:
            teacher = Teacher.objects.get(user__username=teacher_data['username'])
            teacher.name = teacher_data['name'] if teacher_data['name'] else teacher.name
            teacher.dob = teacher_data['dob'] if teacher_data['dob'] else teacher.dob
            teacher.address = teacher_data['address'] if teacher_data['address'] else teacher.address
            teacher.contact = teacher_data['contact'] if teacher_data['contact'] else teacher.contact
            teacher.joiningDate = teacher_data['joiningDate'] if teacher_data['joiningDate'] else teacher.joiningDate
            teacher.about = teacher_data['about'] if teacher_data['about'] else teacher.about
            teacher.qualification = teacher_data['qualification'] if teacher_data[
                'qualification'] else teacher.qualification
            teacher.startedTeaching = teacher_data['startedTeaching'] if teacher_data[
                'startedTeaching'] else teacher.startedTeaching
            teacher.save()
            return TeacherUpdateMutation(success=True)


class TeacherUpdatePrevSchool(graphene.Mutation):
    class Arguments:
        school = graphene.String(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, school):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            if user.teacher.prev_school != school:
                user.teacher.prev_school = school
                user.teacher.save()
            return TeacherUpdatePrevSchool(success=True)


class TeacherDeleteMutation(graphene.Mutation):
    class Arguments:
        username = graphene.String()

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, username):
        if info.context.user.is_authenticated:
            Teacher.objects.get(user__username=username).delete()
            return TeacherDeleteMutation(success=True)


class Mutation(graphene.ObjectType):
    create_teacher = TeacherCreateMutation.Field()
    update_teacher = TeacherUpdateMutation.Field()
    update_teacher_prev_school = TeacherUpdatePrevSchool.Field()
    delete_teacher = TeacherDeleteMutation.Field()
