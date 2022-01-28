import graphene

from attendance.schema import Query as AttendanceQuery, Mutation as AttendanceMutation
from chat.schema import Query as ChatQuery, Mutation as ChatMutation
from exam.schema import Query as ExamQuery, Mutation as ExamMutation
from homework.schema import Query as HomeworkQuery, Mutation as HomeworkMutation
from notice.schema import Query as NoticeQuery, Mutation as NoticeMutation
from online_class.schema import Query as OnlineClassQuery, Mutation as OnlineClassMutation
from post.schema import Query as PostQuery, Mutation as PostMutation
from qna.schema import Query as QnaQuery, Mutation as QnaMutation
from report.schema import Query as ReportQuery, Mutation as ReportMutation
from school.schema import Query as SchoolQuery, Mutation as SchoolMutation
from student.schema import Query as StudentQuery, Mutation as StudentMutation
from teacher.schema import Query as TeacherQuery, Mutation as TeacherMutation
from test.schema import Query as TestQuery, Mutation as TestMutation
from timetable.schema import Query as TimetableQuery, Mutation as TimetableMutation
from user.schema import Query as UserQuery, Mutation as UserMutation


class Query(UserQuery, SchoolQuery, StudentQuery, TeacherQuery, ReportQuery, HomeworkQuery,
            NoticeQuery, PostQuery, OnlineClassQuery, QnaQuery, TestQuery, TimetableQuery, ExamQuery, ChatQuery,
            AttendanceQuery, graphene.ObjectType):
    pass


class Mutation(UserMutation, SchoolMutation, StudentMutation, TeacherMutation, ReportMutation,
               HomeworkMutation, NoticeMutation, PostMutation, OnlineClassMutation, QnaMutation, TestMutation,
               TimetableMutation, ExamMutation, ChatMutation, AttendanceMutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
