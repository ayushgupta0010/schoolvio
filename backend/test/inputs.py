import graphene


class TestInput(graphene.InputObjectType):
    title = graphene.String(required=True)
    duration = graphene.Int(required=True)
    classSection = graphene.String(required=True)
    subject = graphene.String(required=True)
    questions = graphene.JSONString(required=True)
