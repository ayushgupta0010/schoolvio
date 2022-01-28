import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType

from school.types import SchoolType
from student.types import StudentType
from teacher.types import TeacherType

User = get_user_model()


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'photo',
            'role',
            'isProfileCompleted',
            'isSchoolVerified',
            'isSuspended',
            'reason',
            'followers',
            'following',
        ]

    followers_count = graphene.Int()
    following_count = graphene.Int()
    is_following = graphene.Boolean()
    is_online = graphene.Boolean()

    def resolve_followers_count(self, info):
        if info.context.user.is_authenticated:
            return self.followers.count()

    def resolve_following_count(self, info):
        if info.context.user.is_authenticated:
            return self.following.count()

    def resolve_is_following(self, info):
        # here `me` is the user who has made the request
        # `self` is the user for whom the query has been made
        me = info.context.user
        if me.is_authenticated:
            return me.is_following(self)

    def resolve_is_online(self, info):
        if info.context.user.is_authenticated:
            return self.is_online()


class UsersUnionType(graphene.Union):
    class Meta:
        types = [SchoolType, StudentType, TeacherType]
