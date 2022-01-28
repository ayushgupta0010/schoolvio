import graphene
from graphene_django import DjangoObjectType

from .models import Post, Like


class PostType(DjangoObjectType):
    class Meta:
        model = Post
        fields = '__all__'

    is_liked_by_user = graphene.Boolean()
    likes = graphene.Int()

    def resolve_is_liked_by_user(self, info):
        user = info.context.user
        if user.is_authenticated:
            return self.likes.filter(user=user) and True or False

    def resolve_likes(self, info):
        user = info.context.user
        if user.is_authenticated:
            return self.likes.count()


class LikeType(DjangoObjectType):
    class Meta:
        model = Like
        fields = '__all__'
