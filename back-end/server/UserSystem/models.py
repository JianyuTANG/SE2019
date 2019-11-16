from django.db import models
from django.utils import timezone


class UserInfo(models.Model):
    real_name = models.CharField(max_length=32, default='')  # 真名
    number_of_entry = models.CharField(max_length=32, default='')  # 期数

    # student_id = models.CharField(max_length=32)                                  # 学号
    # password = models.CharField(max_length=32)                                    # 后期扩展用。若只限于微信小程序，则无需密码
    # create_time = models.DateTimeField(default=timezone.now())

    city = models.CharField(max_length=64, default='')  # 城市 （邮编码）
    field = models.CharField(max_length=64, default='')  # 领域 （数字编码）
    department = models.CharField(max_length=64, default='')  # 院系 （学校官方数字编码）
    wechatid = models.CharField(max_length=64, default='')  # 微信号（手机号）
    tel = models.CharField(max_length=20, default='')  # 电话
    email = models.CharField(max_length=64, default='')  # 邮箱
    self_discription = models.CharField(max_length=600, default='')  # 自我介绍
    company = models.CharField(max_length=100, default='')  # 公司
    hobby = models.CharField(max_length=100, default='')  # 爱好
    avatar_url = models.CharField(max_length=100,
                                  default='/media/user_avatar/default/default.jpg')  # 头像

    def __str__(self):
        return self.real_name


# Create your models here.
class User(models.Model):
    # username = models.CharField(max_length=32, unique=True)                        # 用户名（或者叫昵称？）此为可选项，留待讨论
    openid = models.CharField(max_length=32, unique=True, null=True)                          # 用户的唯一标识，微信官方提供
    session_key = models.CharField(max_length=32, default='')                      # 本次登录的session_key
    logon_status = models.IntegerField(default=-1)                                 # 用户身份的验证状态，0学生 1辅导员 <0游客
    info = models.OneToOneField(UserInfo, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.openid
