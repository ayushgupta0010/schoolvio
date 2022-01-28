import graphene


class TeacherCreateInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    address = graphene.String(required=True)
    dob = graphene.Date(required=True)
    contact = graphene.String(required=True)
    startedTeaching = graphene.Int(required=True)
    joiningDate = graphene.Date(required=True)
    qualification = graphene.String(required=True)
    about = graphene.String(required=True)
    school = graphene.String(required=True)


class TeacherUpdateInput(graphene.InputObjectType):
    username = graphene.String(required=True)
    name = graphene.String()
    address = graphene.String()
    dob = graphene.Date()
    contact = graphene.String()
    startedTeaching = graphene.Int()
    joiningDate = graphene.Date()
    qualification = graphene.String()
    about = graphene.String()
