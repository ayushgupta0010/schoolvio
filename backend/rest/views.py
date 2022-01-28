import random

from django.contrib.auth import get_user_model
from django.db.models import Q, Prefetch
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from qna.models import Question
from school.models import School
from student.models import Student
from teacher.models import Teacher

User = get_user_model()


def get_results_list(students, teachers, schools):
    results = []
    for student in students:
        detail = {'username': f'{student}', 'name': student.name, 'role': student.user.role.upper(),
                  'classSection': student.classSection, 'photo': student.user.photo,
                  'admNo': student.admNo, 'school': f'{student.school}'}
        results.append(detail)
    for teacher in teachers:
        detail = {'username': f'{teacher}', 'name': teacher.name, 'role': teacher.user.role.upper(),
                  'photo': teacher.user.photo, 'school': f'{teacher.school}'}
        results.append(detail)
    for school in schools:
        detail = {'username': f'{school}', 'name': school.name, 'role': school.user.role.upper(),
                  'photo': school.user.photo, 'principal': school.principal}
        results.append(detail)
    return results


class CountView(APIView):
    def get(self, request):
        student = Student.objects.count()
        teacher = Teacher.objects.count()
        school = School.objects.count()
        response = {'student': student, 'teacher': teacher, 'school': school, 'total': student + teacher + school}
        return Response(response, status=status.HTTP_200_OK)


class PeopleView(APIView):
    def get(self, request, username):
        user = User.objects.get(username=username)
        if user.role == 'school':
            teachers = user.school.teachers.all()
            people = list(teachers)
        elif user.role == 'teacher':
            school = user.teacher.school
            prev_school = user.teacher.prev_school
            teachers = school.teachers.all()[:15]
            students = school.students.all()[:15]
            prev_teachers = Teacher.objects.filter(school__user__username=prev_school)[:15]
            prev_students = Student.objects.filter(school__user__username=prev_school)[:15]
            people = list(teachers) + list(prev_teachers) + list(students) + list(prev_students)
        else:
            school = user.student.school
            prev_school = user.student.prev_school
            teachers = school.teachers.all()[:15]
            students = school.students.all()[:15]
            prev_teachers = Teacher.objects.filter(school__user__username=prev_school)[:15]
            prev_students = Student.objects.filter(school__user__username=prev_school)[:15]
            people = list(teachers) + list(prev_teachers) + list(students) + list(prev_students)
        random.shuffle(people)
        results = [{'username': f'{p}', 'photo': p.user.photo} for p in people]
        return Response(results, status=status.HTTP_200_OK)


class SearchByNameView(APIView):
    def get(self, request, name):
        name = name.replace('-', ' ')
        students = Student.objects.filter(name__contains=name).prefetch_related(Prefetch('user'))
        teachers = Teacher.objects.filter(name__contains=name).prefetch_related(Prefetch('user'))
        schools = School.objects.filter(name__contains=name).prefetch_related(Prefetch('user'))
        results = get_results_list(students, teachers, schools)
        return Response(results, status=status.HTTP_200_OK)


class SearchByUsernameView(APIView):
    def get(self, request, username):
        students = Student.objects.filter(user__username__contains=username).prefetch_related(Prefetch('user'))
        teachers = Teacher.objects.filter(user__username__contains=username).prefetch_related(Prefetch('user'))
        schools = School.objects.filter(user__username__contains=username).prefetch_related(Prefetch('user'))
        results = get_results_list(students, teachers, schools)
        return Response(results, status=status.HTTP_200_OK)


class SearchByQuestionView(APIView):
    def get(self, request, question):
        question = question.replace('-', ' ')
        questions = Question.objects.filter(question__contains=question).prefetch_related(Prefetch('get_answers'))
        results = [{'id': q.id, 'question': q.question, 'answers': q.get_answers.count()} for q in questions]
        return Response(results, status=status.HTTP_200_OK)


class SearchInSpecificSchool(APIView):
    def get(self, request, school, search):
        students = Student.objects.filter(
            Q(school__user__username=school)
            & (Q(user__username__contains=search) | Q(name__contains=search) | Q(admNo=search))
        ).prefetch_related(Prefetch('user'))
        teachers = Teacher.objects.filter(
            Q(school__user__username=school)
            & (Q(user__username__contains=search) | Q(name__contains=search))
        ).prefetch_related(Prefetch('user'))
        results = get_results_list(students, teachers, [])
        return Response(results, status=status.HTTP_200_OK)


class UserFCMTokenView(APIView):
    def post(self, request, username):
        user = User.objects.get(username=username)
        token = request.data.get('token')
        if user.fcm.token != token:
            user.fcm.token = token
            user.fcm.save()
        return Response('Saved', status=status.HTTP_200_OK)
