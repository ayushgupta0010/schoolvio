import graphene
from django.contrib.auth import get_user_model
from django.core.cache import cache
from graphql_auth import mutations
from graphql_auth.schema import MeQuery, UserQuery

from .tasks import follow_notifier
from .types import UsersUnionType

User = get_user_model()


class Query(MeQuery, UserQuery, graphene.ObjectType):
    detail_for = graphene.Field(UsersUnionType, username=graphene.String(required=True))

    @staticmethod
    def resolve_detail_for(self, info, username):
        if info.context.user.is_authenticated:
            cache_query = f'detail_for_{username}'
            cached_profile = cache.get(cache_query)
            if cached_profile:
                return cached_profile
            user = User.objects.get(username=username)
            if not user.role:
                return
            if user.role == 'school':
                profile = user.school
            elif user.role == 'student':
                profile = user.student
            else:
                profile = user.teacher
            cache.set(cache_query, profile, 60)
            return profile


class FollowMutation(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, username):
        me = info.context.user
        if me.is_authenticated:
            user = User.objects.get(username=username)
            me.following.add(user)
            msg = f'{me} started following you.'
            follow_notifier.delay(me.id, user.id, msg, user.username, user.is_online(), user.fcm.token)
            return FollowMutation(success=True)


class UnfollowMutation(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, username):
        me = info.context.user
        if me.is_authenticated:
            user = User.objects.get(username=username)
            me.following.remove(user)
            return UnfollowMutation(success=True)


class UserUpdateMutation(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        photo = graphene.String()
        reason = graphene.String()
        isSuspended = graphene.Boolean()
        isSchoolVerified = graphene.Boolean()
        isProfileCompleted = graphene.Boolean()

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, **kwargs):
        if info.context.user.is_authenticated:
            User.objects.filter(username=kwargs.pop('username')).update(**kwargs)
            return UserUpdateMutation(success=True)


class Mutation(graphene.ObjectType):
    signup = mutations.Register.Field()
    login = mutations.ObtainJSONWebToken.Field()
    refresh_token = mutations.RefreshToken.Field()
    revoke_token = mutations.RevokeToken.Field()
    resend_activation_email = mutations.ResendActivationEmail.Field()
    send_password_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()
    password_change = mutations.PasswordChange.Field()
    verify_account = mutations.VerifyAccount.Field()
    update_user_auth = mutations.UpdateAccount.Field()

    follow_user = FollowMutation.Field()
    unfollow_user = UnfollowMutation.Field()
    update_user_detail = UserUpdateMutation.Field()
