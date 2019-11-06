from django.db import models
from django.utils import timezone


# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=32, unique=True)          # 用户名（或者叫昵称？）此为可选项，留待讨论
    openid = models.CharField(max_length=32, unique=True)            # 用户的唯一标识，微信官方提供
    logon_status = models.IntegerField()                             # 用户身份的验证状态，0学生 1辅导员 <0游客
    real_name = models.CharField(max_length=32)                      # 真名
    number_of_entry = models.IntegerField()                          # 期数
    #student_id = models.CharField(max_length=32)                    # 学号
    password = models.CharField(max_length=32)                       # 后期扩展用。若只限于微信小程序，则无需密码
    create_time = models.DateTimeField(default=timezone.now())
    city = models.IntegerField()                                     # 城市 （邮编码）
    field = models.IntegerField()                                    # 领域 （数字编码）
    department = models.IntegerField()                               # 院系 （学校官方数字编码）
    wechatid = models.CharField(max_length=64)                       # 微信号（手机号）
    tel = models.CharField(max_length=20)                            # 电话
    email = models.CharField(max_length=64)                          # 邮箱
    self_discription = models.CharField(max_length=600)              # 自我介绍
    self.avatar_url = models.CharField(max_length=100)               # 头像

    def __str__(self):
        return self.username
