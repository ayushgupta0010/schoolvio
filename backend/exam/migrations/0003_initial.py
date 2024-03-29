# Generated by Django 3.2 on 2022-05-18 22:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('school', '0001_initial'),
        ('exam', '0002_initial'),
        ('teacher', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='result',
            name='teacher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='get_teacher_results', to='teacher.teacher'),
        ),
        migrations.AddField(
            model_name='exam',
            name='school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='get_exams', to='school.school'),
        ),
        migrations.AlterUniqueTogether(
            name='writtenexamanswer',
            unique_together={('student', 'written_exam')},
        ),
        migrations.AlterUniqueTogether(
            name='writtenexam',
            unique_together={('exam', 'subject', 'classSection', 'publishDate')},
        ),
        migrations.AlterUniqueTogether(
            name='studentresult',
            unique_together={('exam', 'student')},
        ),
        migrations.AlterUniqueTogether(
            name='result',
            unique_together={('exam', 'teacher')},
        ),
    ]
