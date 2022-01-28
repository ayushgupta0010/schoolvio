import graphene
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.db.models import Prefetch

from .models import Post, Like
from .types import PostType

User = get_user_model()


class Query(graphene.ObjectType):
    list_posts_by = graphene.List(PostType, username=graphene.String(required=True))
    list_posts_for = graphene.List(PostType)
    post_detail = graphene.Field(PostType, pk=graphene.ID(required=True))

    @staticmethod
    def resolve_list_posts_by(self, info, username):
        if info.context.user.is_authenticated:
            user = User.objects.get(username=username)
            cache_query = f'posts_by_{username}'
            cached_posts = cache.get(cache_query)
            if cached_posts:
                return cached_posts
            posts = user.posts.all().order_by('-timestamp')
            cache.set(cache_query, posts, None)
            return posts

    @staticmethod
    def resolve_list_posts_for(self, info):
        user = info.context.user
        if user.is_authenticated:
            cache_query = f'posts_for_{user}'
            cached_posts = cache.get(cache_query)
            if cached_posts:
                return cached_posts
            posts_for_user = []
            followed_users = user.following.prefetch_related(Prefetch('posts'))
            for followed_user in followed_users:
                posts_for_user += followed_user.posts.all()
            cache.set(cache_query, posts_for_user, 60)
            return posts_for_user

    @staticmethod
    def resolve_post_detail(self, info, pk):
        if info.context.user.is_authenticated:
            cache_query = f'post_{pk}'
            cached_post = cache.get(cache_query)
            if cached_post:
                return cached_post
            post = Post.objects.filter(pk=pk).first()
            cache.set(cache_query, post, 60)
            return post


class PostCreateMutation(graphene.Mutation):
    class Arguments:
        photo = graphene.String(required=True)
        desc = graphene.String()

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, photo, desc):
        user = info.context.user
        if user.is_authenticated:
            Post.objects.create(user=user, photo=photo, description=desc)
            return PostCreateMutation(success=True)


class LikeMutation(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)

    likes = graphene.Int()

    @classmethod
    def mutate(cls, root, info, post_id):
        user = info.context.user
        if user.is_authenticated:
            liked_post = Post.objects.get(id=post_id)
            new_like, created = Like.objects.get_or_create(user=user, post=liked_post)
            if not created:
                new_like.delete()
            likes = liked_post.likes.count()
            return LikeMutation(likes=likes)


class Mutation(graphene.ObjectType):
    create_post = PostCreateMutation.Field()
    like_post = LikeMutation.Field()
