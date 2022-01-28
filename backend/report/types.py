from graphene_django import DjangoObjectType

from .models import Report


class ReportType(DjangoObjectType):
    class Meta:
        model = Report
        fields = '__all__'
