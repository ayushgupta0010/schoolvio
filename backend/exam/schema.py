import graphene
from django.core.cache import cache
from django.db import IntegrityError

from .models import Exam, Result, Subject, WrittenExam, WrittenExamAnswer
from .tasks import exam_publisher
from .types import ExamType, ResultType, SubjectType, StudentResultType, WrittenExamType, WrittenExamAnswerType


class Query(graphene.ObjectType):
    exams = graphene.List(ExamType, school=graphene.String(required=True))
    result_by_id = graphene.Field(ResultType, pk=graphene.ID(required=True))
    results_by_teacher = graphene.List(ResultType)
    results_for_school = graphene.Field(
        ResultType,
        exam_id=graphene.ID(required=True),
        class_section=graphene.String(required=True)
    )
    results_for_student = graphene.List(StudentResultType)
    subjects = graphene.Field(SubjectType, school=graphene.String(required=True))
    written_exams_by_school = graphene.List(WrittenExamType)
    written_exams_for_student = graphene.List(WrittenExamType)
    written_exams_ans_for_teacher = graphene.List(
        WrittenExamAnswerType,
        subject=graphene.String(required=True),
        written_exam_id=graphene.ID(required=True),
        class_section=graphene.String(required=True),
    )

    @staticmethod
    def resolve_exams(self, info, school):
        if info.context.user.is_authenticated:
            cache_query = f'exams_by_school_{school}'
            cached_exams = cache.get(cache_query)
            if cached_exams:
                return cached_exams
            exams = Exam.objects.filter(school__user__username=school)
            cache.set(cache_query, exams, 60)
            return exams

    @staticmethod
    def resolve_result_by_id(self, info, pk):
        if info.context.user.is_authenticated:
            cache_query = f'result_{pk}'
            cached_result = cache.get(cache_query)
            if cached_result:
                return cached_result
            result = Result.objects.filter(pk=pk).first()
            cache.set(cache_query, result, 60)
            return result

    @staticmethod
    def resolve_results_for_student(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'student':
            cache_query = f'results_for_student_{user}'
            cached_results = cache.get(cache_query)
            if cached_results:
                return cached_results
            results = user.student.get_student_results.all()
            cache.set(cache_query, results, 60)
            return results

    @staticmethod
    def resolve_results_by_teacher(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            cache_query = f'results_for_teacher_{user}'
            cached_results = cache.get(cache_query)
            if cached_results:
                return cached_results
            results = user.teacher.get_teacher_results.all()
            cache.set(cache_query, results, 60)
            return results

    @staticmethod
    def resolve_results_for_school(self, info, exam_id, class_section):
        if info.context.user.is_authenticated:
            cache_query = f'result_for_exam_{exam_id}_class_{class_section}'
            cached_result = cache.get(cache_query)
            if cached_result:
                return cached_result
            result = Result.objects.filter(exam_id=exam_id, classSection=class_section).first()
            cache.set(cache_query, result, 60)
            return result

    @staticmethod
    def resolve_subjects(self, info, school):
        user = info.context.user
        if user.is_authenticated:
            cache_query = f'subjects_in_{school}'
            cached_subject = cache.get(cache_query)
            if cached_subject:
                return cached_subject
            sub = Subject.objects.filter(school__user__username=school).first()
            cache.set(cache_query, sub, 86400)
            return sub

    @staticmethod
    def resolve_written_exams_by_school(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'school':
            cache_query = f'written_exams_by_school_{user}'
            cached_exams = cache.get(cache_query)
            if cached_exams:
                return cached_exams
            exams = WrittenExam.objects.filter(exam__school=user.school)
            cache.set(cache_query, exams, 60)
            return exams

    @staticmethod
    def resolve_written_exams_for_student(self, info):
        user = info.context.user
        if user.is_authenticated and user.role == 'student':
            s = user.student
            cache_query = f'written_exams_for_student_{user}'
            cached_exams = cache.get(cache_query)
            if cached_exams:
                return cached_exams
            exams = WrittenExam.objects.filter(classSection=s.classSection, exam__school=s.school)
            cache.set(cache_query, exams, 120)
            return exams

    @staticmethod
    def resolve_written_exams_ans_for_teacher(self, info, written_exam_id, subject, class_section):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            t = user.teacher
            cache_query = f'written_exam_ans_for_{user}'
            cached_ans = cache.get(cache_query)
            if cached_ans:
                return cached_ans
            ans = WrittenExamAnswer.objects.filter(
                student__school=t.school,
                written_exam__subject=subject,
                written_exam_id=written_exam_id,
                student__classSection=class_section,
            )
            cache.set(cache_query, ans, 60)
            return ans


class ExamCreateMutation(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)

    success = graphene.Boolean()
    exam = graphene.Field(ExamType)

    @classmethod
    def mutate(cls, root, info, name):
        user = info.context.user
        if user.is_authenticated and user.role == 'school':
            exam = Exam.objects.create(name=name, school=user.school)
            return ExamCreateMutation(success=True, exam=exam)


class ExamPublishMutation(graphene.Mutation):
    class Arguments:
        pk = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, pk):
        user = info.context.user
        if user.is_authenticated and user.role == 'school':
            Exam.objects.filter(pk=pk).update(isPublished=True)
            exam_publisher.delay(pk)
            return ExamPublishMutation(success=True)


class ExamDeleteMutation(graphene.Mutation):
    class Arguments:
        pk = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, pk):
        user = info.context.user
        if user.is_authenticated and user.role == 'school':
            Exam.objects.get(pk=pk).delete()
            return ExamDeleteMutation(success=True)


class ResultCreateMutation(graphene.Mutation):
    class Arguments:
        exam_id = graphene.ID(required=True)
        classSection = graphene.String(required=True)
        results = graphene.JSONString(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            try:
                Result.objects.create(**kwargs, teacher=user.teacher)
            except IntegrityError:
                return ResultCreateMutation(success=False)
            return ResultCreateMutation(success=True)


class ResultEditMutation(graphene.Mutation):
    class Arguments:
        exam_id = graphene.ID(required=True)
        results = graphene.JSONString(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, exam_id, results):
        user = info.context.user
        if user.is_authenticated and user.role == 'teacher':
            Result.objects.filter(exam_id=exam_id, teacher=user.teacher).update(results=results)
            return ResultCreateMutation(success=True)


class SubjectMutation(graphene.Mutation):
    class Arguments:
        data = graphene.JSONString(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, data):
        user = info.context.user
        if user.is_authenticated and user.role == 'school':
            user.school.subject.data = data
            user.school.subject.save()
            return SubjectMutation(success=True)


class WrittenExamCreateMutation(graphene.Mutation):
    class Arguments:
        exam_id = graphene.ID(required=True)
        files = graphene.String(required=True)
        publishDate = graphene.DateTime(required=True)
        subject = graphene.String(required=True)
        duration = graphene.Int(required=True)
        classSection = graphene.String(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user
        if user.is_authenticated and user.role == 'school':
            try:
                WrittenExam.objects.create(**kwargs)
            except IntegrityError:
                return WrittenExamCreateMutation(success=False)
            return WrittenExamCreateMutation(success=True)


class WrittenExamDeleteMutation(graphene.Mutation):
    class Arguments:
        pk = graphene.ID(required=True)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, pk):
        user = info.context.user
        if user.is_authenticated and user.role == 'school':
            WrittenExam.objects.get(pk=pk).delete()
            return WrittenExamDeleteMutation(success=True)


class WrittenExamAnswerCreateMutation(graphene.Mutation):
    class Arguments:
        pk = graphene.ID(required=True)
        files = graphene.String()

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, pk, files):
        user = info.context.user
        if user.is_authenticated and user.role == 'student':
            try:
                WrittenExamAnswer.objects.create(written_exam_id=pk, files=files, student=user.student)
            except IntegrityError:
                return WrittenExamAnswerCreateMutation(success=False)
            return WrittenExamAnswerCreateMutation(success=True)


class Mutation(graphene.ObjectType):
    create_exam = ExamCreateMutation.Field()
    publish_exam = ExamPublishMutation.Field()
    delete_exam = ExamDeleteMutation.Field()
    create_result = ResultCreateMutation.Field()
    edit_result = ResultEditMutation.Field()
    update_subject = SubjectMutation.Field()
    create_written_exam = WrittenExamCreateMutation.Field()
    delete_written_exam = WrittenExamDeleteMutation.Field()
    create_written_exam_answer = WrittenExamAnswerCreateMutation.Field()
