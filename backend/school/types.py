import graphene
from django.utils import timezone
from graphene_django import DjangoObjectType

from .models import School, Subscription


class SchoolType(DjangoObjectType):
    class Meta:
        model = School
        fields = '__all__'

    is_subscription_expired = graphene.Boolean()

    def resolve_is_subscription_expired(self, info):
        if info.context.user.is_authenticated:
            return timezone.now() >= self.subscription.end_date


class SubscriptionType(DjangoObjectType):
    class Meta:
        model = Subscription
        fields = '__all__'
