import graphene

from .models import Report


class Query(graphene.ObjectType):
    pass


class ReportMutation(graphene.Mutation):
    class Arguments:
        q_type = graphene.String(required=True)
        query = graphene.String(required=True)

    success = graphene.String()

    @classmethod
    def mutate(cls, root, info, q_type, query):
        user = info.context.user
        if user.is_authenticated:
            Report.objects.create(user=user, queryType=q_type, query=query)
            return ReportMutation(success=True)


class Mutation(graphene.ObjectType):
    create_report = ReportMutation.Field()
