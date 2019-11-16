from django.contrib import admin

# Register your models here.
from .models import User, UserInfo

admin.site.register(User)
admin.site.register(UserInfo)
