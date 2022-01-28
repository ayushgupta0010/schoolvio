import graphene
from django.contrib.auth import get_user_model
from django.core.cache import cache

from chat.models import Group, Contact
from notification.tasks import send_push_notification
from user.types import UsersUnionType
from .models import School
from .types import SubscriptionType

User = get_user_model()


class Query(graphene.ObjectType):
    school_unverified_users = graphene.List(graphene.String)
    suspended_users = graphene.List(UsersUnionType)
    subscription = graphene.Field(SubscriptionType)

    @staticmethod
    def resolve_school_unverified_users(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'school':
            school = user.school
            cache_query = f'unverified_users_of_{school}'
            unverified_users = cache.get(cache_query)
            if unverified_users:
                return unverified_users
            students = school.students.filter(user__isSchoolVerified=False)
            teachers = school.teachers.filter(user__isSchoolVerified=False)
            results = [x.user.username for x in students]
            [results.append(x.user.username) for x in teachers]
            cache.set(cache_query, results, None)
            return results

    @staticmethod
    def resolve_suspended_users(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'school':
            school = user.school
            students = school.students.filter(user__isSuspended=True)
            teachers = school.teachers.filter(user__isSuspended=True)
            return list(students) + list(teachers)

    @staticmethod
    def resolve_subscription(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'school':
            return user.school.subscription


class SchoolCreateMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        principal = graphene.String(required=True)
        address = graphene.String(required=True)
        contact = graphene.String(required=True)
        board = graphene.String(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user
        if user.is_authenticated:
            kwargs['user'] = user
            School.objects.create(**kwargs)
            return SchoolCreateMutation(success=True)


class SchoolUpdateMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String()
        principal = graphene.String()
        contact = graphene.String()

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user
        if user.is_authenticated and user.role == 'school':
            school = user.school
            school.name = kwargs['name'] if kwargs['name'] else school.name
            school.principal = kwargs['principal'] if kwargs['principal'] else school.principal
            school.contact = kwargs['contact'] if kwargs['contact'] else school.contact
            school.save()
            return SchoolUpdateMutation(success=True)


class SchoolVerifyUserMutation(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        photo = graphene.String(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, username, photo):
        user = info.context.user
        if user.is_authenticated and user.role == 'school':
            verify_user = User.objects.get(username=username)
            verify_user.isSchoolVerified = True
            verify_user.photo = photo

            # add student to class group
            if verify_user.role == 'student':
                class_section = verify_user.student.classSection[2:].replace('_', '-')
                cls_name = f'{verify_user.student.school}~{class_section}'
                group = Group.objects.get(name=cls_name)
                Contact.objects.get_or_create(group=group, user=verify_user, display_name=f'Class {class_section}')

            verify_user.save()
            send_push_notification.delay(
                [verify_user.fcm.token],
                'School Verification',
                'You have been verified by your school'
            )
            cache_unverified_users_query = f'unverified_users_of_{user}'
            cached_unverified_users = cache.get(cache_unverified_users_query)
            if cached_unverified_users:
                try:
                    cached_unverified_users.remove(username)
                except ValueError:
                    pass
            else:
                cached_unverified_users = []
            cache.set(cache_unverified_users_query, cached_unverified_users, None)
            return SchoolVerifyUserMutation(success=True)


class Mutation(graphene.ObjectType):
    create_school = SchoolCreateMutation.Field()
    update_school = SchoolUpdateMutation.Field()
    verify_school_user = SchoolVerifyUserMutation.Field()
