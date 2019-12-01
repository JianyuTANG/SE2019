from django.db import models

# Create your models here.
class Resource(models.Model):
    openid = models.CharField(max_length=32, null=True)                             # 用户的唯一标识，微信官方提供
    title = models.CharField(max_length=100, default='') 
    name = models.CharField(max_length=100, default='')               # 字符串格式 发布人姓名 最长100个字符
    cover_img = models.CharField(max_length=10000, default='')
    content = models.TextField(default='')                             # 字符串格式 资源正文 最长99999个字符
    due = models.CharField(max_length=100, default='')                                   # 截止日期
    contact = models.CharField(max_length=100, default='')                               # 联系方式 邮箱或手机号码等
    c_time = models.DateTimeField(auto_now_add=True)                                     # 自动添加 资源生成时间
    res_id = models.AutoField(primary_key=True)
    img_arr = models.TextField(default='')  
    tag_arr = models.TextField(default='')  
    interest_users = models.TextField(default='')
    category = models.CharField(max_length=100, default='')

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["-c_time"]
        verbose_name = "Resource"
        verbose_name_plural = "Resources"