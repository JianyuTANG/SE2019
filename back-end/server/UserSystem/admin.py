from django.contrib import admin

# Register your models here.
from .models import User, UserInfo, Group_num

admin.site.register(User)
admin.site.register(UserInfo)
admin.site.register(Group_num)
