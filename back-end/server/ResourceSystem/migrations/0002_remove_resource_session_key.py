# Generated by Django 2.2.5 on 2019-11-21 15:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ResourceSystem', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='resource',
            name='session_key',
        ),
    ]