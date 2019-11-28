"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
import UserSystem.views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('login', UserSystem.views.login),
    path('verify', UserSystem.views.verify),
    path('invite', UserSystem.views.invite),
    path('basic_user_info', UserSystem.views.register),
    path('modify_user_info', UserSystem.views.modify_user),
    path('view_user', UserSystem.views.query_user),
    path('upload_user_avatar', UserSystem.views.upload_user_avatar),
    path('get_user_avatar', UserSystem.views.get_user_avartar),
    path('add_userinfo', UserSystem.views.create_userinfo),
    path('upload_img', UserSystem.views.upload_img),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
