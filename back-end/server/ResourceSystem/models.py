from django.db import models

# Create your models here.
class Resource(models.Model):
    # username = models.CharField(max_length=32, unique=True)                      # 用户名（或者叫昵称？）此为可选项，留待讨论

    openid = models.CharField(max_length=32, null=True)                             # 用户的唯一标识，微信官方提供
    #session_key = models.CharField(max_length=32, default='')                      # 本次登录的session_key
    title = models.CharField(max_length=100, default='')                                 # 字符串格式 资源标题 最长100个字符
    content = models.TextField(default='')                             # 字符串格式 资源正文 最长99999个字符
    due = models.CharField(max_length=100, default='')                                   # 截止日期
    contact = models.CharField(max_length=100, default='')                               # 联系方式 邮箱或手机号码等
    c_time = models.DateTimeField(auto_now_add=True)                                     # 自动添加 资源生成时间
    res_id = models.AutoField(primary_key=True)  
    img_arr = models.TextField(default='')                                        # 资源主键 自增   

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["-c_time"]
        verbose_name = "Resource"
        verbose_name_plural = "Resources"