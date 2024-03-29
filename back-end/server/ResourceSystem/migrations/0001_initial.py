# Generated by Django 2.2.5 on 2019-12-18 11:22

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Resource',
            fields=[
                ('openid', models.CharField(max_length=32, null=True)),
                ('title', models.CharField(default='', max_length=100)),
                ('name', models.CharField(default='', max_length=100)),
                ('cover_img', models.CharField(default='', max_length=10000)),
                ('content', models.TextField(default='')),
                ('due', models.CharField(default='', max_length=100)),
                ('contact', models.CharField(default='', max_length=100)),
                ('c_time', models.DateTimeField(auto_now_add=True)),
                ('res_id', models.AutoField(primary_key=True, serialize=False)),
                ('img_arr', models.TextField(default='')),
                ('tag_arr', models.TextField(default='')),
                ('interest_users', models.TextField(default='')),
                ('category', models.CharField(default='', max_length=100)),
                ('view_num', models.IntegerField(default=0)),
            ],
            options={
                'verbose_name': 'Resource',
                'verbose_name_plural': 'Resources',
                'ordering': ['-c_time'],
            },
        ),
    ]
