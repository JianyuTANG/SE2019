from django.contrib import admin
from . import models
# Register your models here.

class resAdmin(admin.ModelAdmin):
    list_display = ('title','res_id')
    
admin.site.register(models.Resource,resAdmin)