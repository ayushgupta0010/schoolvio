# Generated by Django 3.2 on 2022-05-18 22:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='School',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('principal', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=50)),
                ('address', models.TextField()),
                ('contact', models.CharField(max_length=10)),
                ('board', models.CharField(choices=[('ICSE', 'ICSE'), ('CBSE', 'CBSE'), ('NIOS', 'NIOS'), ('UP', 'UP'), ('JKBOSE', 'JKBOSE'), ('RBSE', 'RBSE'), ('HPBOSE', 'HPBOSE'), ('MPBSE', 'MPBSE'), ('CGBSE', 'CGBSE'), ('PSEB', 'PSEB'), ('BSEH', 'BSEH'), ('BSEB', 'BSEB'), ('GSEB', 'GSEB'), ('MSBSHSE', 'MSBSHSE'), ('BIEAP', 'BIEAP'), ('BSEAP', 'BSEAP'), ('WBBSE', 'WBBSE'), ('WBCHSE', 'WBCHSE')], max_length=8)),
            ],
        ),
        migrations.CreateModel(
            name='Subscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subscription', models.CharField(choices=[('none', 'No subscription'), ('14-days', '14 days subscription'), ('3-month', '3 month subscription'), ('6-month', '6 month subscription'), ('1-year', '1 year subscription')], default='none', max_length=7)),
                ('start_date', models.DateTimeField(auto_now=True)),
                ('end_date', models.DateTimeField(blank=True, null=True)),
                ('school', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='school.school')),
            ],
        ),
    ]
