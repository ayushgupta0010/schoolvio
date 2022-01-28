import graphene
from django.core.cache import cache

from .models import Notice
from .types import NoticeType


class Query(graphene.ObjectType):
    notices = graphene.List(NoticeType, school=graphene.String(required=True))

    @staticmethod
    def resolve_notices(self, info, school):
        if info.context.user.is_authenticated:
            cache_query = f'notices_for_{school}'
            cached_notices = cache.get(cache_query)
            if cached_notices:
                return cached_notices
            notices = Notice.objects.filter(school__user__username=school).order_by('-timestamp')
            cache.set(cache_query, notices, None)
            return notices


class NoticeMutation(graphene.Mutation):
    class Arguments:
        notice = graphene.String(required=True)

    success = graphene.Boolean()
    error = graphene.String()
    notice = graphene.Field(NoticeType)

    @classmethod
    def mutate(cls, root, info, notice):
        user = info.context.user
        if user.is_authenticated and user.role == 'school':
            notice = Notice.objects.create(notice=notice, school=user.school)
            return NoticeMutation(success=True, error=None, notice=notice)
        return NoticeMutation(success=False, error='This account is not a school account', notice=None)


class Mutation(graphene.ObjectType):
    create_notice = NoticeMutation.Field()
