from django.db import models
from django.utils import timezone

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=32, unique=True)
    openid = models.CharField(max_length=32, unique=True)  # 用户的唯一标识，微信官方提供
    logon_status = models.CharField(max_length=32, unique=True)  # 用户是否已注册，详见竞品分析
    password = models.CharField(max_length=32)  # 不考虑后期扩展，只限于微信小程序，则无需密码
    create_time = models.DateTimeField(default=timezone.now())

    def __str__(self):
        return self.username
