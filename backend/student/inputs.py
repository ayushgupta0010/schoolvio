import graphene


class StudentCreateInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    fatherName = graphene.String(required=True)
    motherName = graphene.String(required=True)
    admNo = graphene.Int(required=True)
    dob = graphene.Date(required=True)
    address = graphene.String(required=True)
    contact = graphene.String(required=True)
    rollNo = graphene.Int(required=True)
    busNo = graphene.String()
    goal = graphene.String(required=True)
    about = graphene.String(required=True)
    classSection = graphene.String(required=True)
    school = graphene.String(required=True)


class StudentUpdateInput(graphene.InputObjectType):
    username = graphene.String(required=True)
    name = graphene.String()
    fatherName = graphene.String()
    motherName = graphene.String()
    admNo = graphene.Int()
    dob = graphene.Date()
    address = graphene.String()
    contact = graphene.String()
    rollNo = graphene.Int()
    busNo = graphene.String()
    goal = graphene.String()
    about = graphene.String()
    classSection = graphene.String()
