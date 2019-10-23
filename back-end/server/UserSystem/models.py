from django.db import models
from django.utils import timezone

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=32, unique=True)  # 用户名（或者叫昵称？）此为可选项，留待讨论
    openid = models.CharField(max_length=32, unique=True)    # 用户的唯一标识，微信官方提供
    logon_status = models.CharField(max_length=32)  # 用户身份的验证状态，guest or alumni
    real_name = models.CharField(max_length=32)     # 真名
    number_of_entry = models.IntegerField()         # 期数
    #student_id = models.CharField(max_length=32)    # 学号
    password = models.CharField(max_length=32)      # 后期扩展用。若只限于微信小程序，则无需密码
    create_time = models.DateTimeField(default=timezone.now())

    def __str__(self):
        return self.username
