# Generated by Django 2.2.5 on 2019-12-17 15:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ResourceSystem', '0008_resource_interest_users'),
    ]

    operations = [
        migrations.AddField(
            model_name='resource',
            name='view_num',
            field=models.IntegerField(default=0),
        ),
    ]