# Generated by Django 2.2.5 on 2019-11-16 14:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('UserSystem', '0004_auto_20191116_2049'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='info',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='UserSystem.UserInfo'),
        ),
    ]
