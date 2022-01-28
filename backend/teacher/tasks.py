from celery import shared_task

from .models import ClassTeacher


def fix_class_section(class_section):
    class_section = class_section.replace('-', '_')
    return f'C_{class_section}'


@shared_task
def check_class_teachers(timetable):
    if timetable is None:
        return
    for cls in timetable.keys():
        ct = timetable[cls].get('classTeacher', 0)
        if ct != 0:
            ClassTeacher.objects.filter(teacher__user__username=ct).update(classSection=fix_class_section(cls))
