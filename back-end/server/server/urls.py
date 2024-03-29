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
import ResourceSystem.views
import AdminSystem.views
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
    path('add_res', ResourceSystem.views.add_res),
    path('delete_res', ResourceSystem.views.delete_res),
    path('modify_res', ResourceSystem.views.modify_res),
    path('view_res', ResourceSystem.views.view_res),
    path('upload_img', UserSystem.views.upload_img),
    path('delete_img', UserSystem.views.delete_img),
    path('query_res_all', ResourceSystem.views.query_res_all),
    path('query_res_issued', ResourceSystem.views.query_res_issued),
    path('query_res_interested', ResourceSystem.views.query_res_interested),
    path('switch_interest', ResourceSystem.views.switch_interest),
    path('query_user_by_num', UserSystem.views.query_user_by_num),
    path('view_other', UserSystem.views.query_other),
    path('view_other_by_openid', UserSystem.views.query_other_by_openid),
    path('refresh_group', UserSystem.views.refresh_group),
    path('search_res', ResourceSystem.views.serch_res),
    path('query_res_by_openid', ResourceSystem.views.query_res_by_openid),
    path('query_res_by_tags', ResourceSystem.views.query_res_by_tags),
    path('query_res_by_category', ResourceSystem.views.query_res_by_category),
    path('query_all_num', UserSystem.views.query_all_num),
    path('query_group_field', UserSystem.views.query_all_fields),
    path('query_group_mine', UserSystem.views.query_my_groups),
    path('query_res_by_category_tags', ResourceSystem.views.query_res_by_category_tags),
    path('get_other_avatar', UserSystem.views.get_other_avatar),
    path('recommend_res', ResourceSystem.views.recommend_res),
    path('query_res_official', ResourceSystem.views.query_res_official),
    path('admin', AdminSystem.views.homepage_request),
    path('admin_login', AdminSystem.views.login_page),
    path('user_management', AdminSystem.views.management_page),
    path('infopage/<int:id>', AdminSystem.views.userinfo_page),
    path('infopage/adduser', AdminSystem.views.add_user),
    path('delete_user', AdminSystem.views.delete_record),
    path('admin_logout', AdminSystem.views.logout_request),
    path('res_infopage/<int:id>', AdminSystem.views.res_infopage),
    path('res_management', AdminSystem.views.res_management_page),
    path('admin_delete_res', AdminSystem.views.delete_res),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
