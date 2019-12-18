from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.shortcuts import render
from django.shortcuts import redirect  # 重新定向模块
from .userform import UserForm
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User as Superuser
from django.contrib.sessions.models import Session
from UserSystem.models import UserInfo
from ResourceSystem.models import Resource

import os
import json
import datetime
import string
import random


def login_page(request):
    print('superuser login')
    hint_message = ''
    if request.method == 'POST':
        print('POST')
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        if not username or username.isspace():
            hint_message = '用户名不能为空'
        elif not password or password.isspace():
            hint_message = '密码不能为空'
        else:
            user = authenticate(username=username, password=password)
            if not Superuser.objects.filter(username=username):
                hint_message = "用户名不存在"
            elif Superuser.objects.filter(username=username) and user is None:
                hint_message = "密码错误"
            else:
                if login_check(request):
                    if request.user.username == username:
                        # 同一个用户
                        hint_message = "已登录"
                        return redirect("homepage")
                    else:
                        logout(request)
                # 建立session记录
                login(request, user)
                response = HttpResponseRedirect("admin")
                return response
    return render(request, 'login&logon.html', {"hintmessage": hint_message})


def homepage_request(request):
    print(request.user.username)
    if not login_check(request):
        return redirect("/admin_login")
    username = '管理员'
    hint_message = ''
    if request.method == 'POST':
        print('POST')
        old_password = request.POST.get('old_password', '')
        new_password = request.POST.get('password', '')
        confirm_password = request.POST.get('confirm_password', '')
        user = authenticate(username=request.user.username, password=old_password)
        if user is not None and user.is_active:
            if not new_password.isspace() and new_password == confirm_password:
                user.set_password(new_password)
                hint_message = '修改密码成功'
                print('666')
                user.save()
            else:
                hint_message = '新密码为空或与确认不一致'
        else:
            print('999')
            hint_message = '原密码错误'
    return render(request, 'homepage.html', {"username": username, "hintmessage": hint_message})


def userinfo_page(request, id):
    if not login_check(request):
        return redirect("/admin_login")
    try:
        userinfo = UserInfo.objects.get(id=id)
    except:
        return redirect("/user_management")

    username = '管理员'
    if request.method == 'POST':
        realname = request.POST.get('realname', '')
        num = request.POST.get('num', '')
        department = request.POST.get('department', '')
        city = request.POST.get('city', '')
        userinfo.real_name = realname
        userinfo.number_of_entry = num
        userinfo.department = department
        userinfo.city = city
        userinfo.save()
    info = {}
    info['realname'] = userinfo.real_name
    info['num'] = userinfo.number_of_entry
    info['department'] = userinfo.department
    info['city'] = userinfo.city
    return render(request, 'personal_info.html', {"username": username, 'userinfo': info})


def add_user(request):
    if not login_check(request):
        return redirect("/admin_login")
    username = '管理员'
    info = {}
    info['realname'] = ''
    info['num'] = ''
    info['department'] = ''
    info['city'] = ''
    if request.method == 'POST':
        realname = request.POST.get('realname', '')
        num = request.POST.get('num', '')
        department = request.POST.get('department', '')
        city = request.POST.get('city', '')
        userinfo = UserInfo.objects.create()
        userinfo.real_name = realname
        userinfo.department = department
        userinfo.number_of_entry = num
        userinfo.city = city
        userinfo.save()
    return render(request, 'personal_info.html', {"username": username, 'userinfo': info})


def res_infopage(request, id):
    if not login_check(request):
        return redirect("/admin_login")
    try:
        resinfo = Resource.objects.get(res_id=id)
    except:
        return redirect("/res_management")
    username = '管理员'
    info = {}
    info['title'] = resinfo.title
    info['name'] = resinfo.name
    info['due'] = resinfo.due
    info['content'] = resinfo.content
    return render(request, 'res_info.html', {"username": username, 'resinfo': info})


def management_page(request):
    if not login_check(request):
        return redirect("admin_login")
    username = '管理员'
    p = Paginator(UserInfo.objects.all().order_by('-id'), 20)
    page = request.GET.get('page')  # 获取页码
    if page:
        pass
    else:
        page = 1
    try:
        a_a = p.page(page)             # 获取某页对应的记录
        page1 = p.page(page)
        page_list = page1.object_list
    except PageNotAnInteger:           # 如果页码不是个整数
        a_a = p.page(1)                # 取第一页的记录
        page1 = p.page(1)
        page_list = page1.object_list
    except EmptyPage:                  # 如果页码太大，没有相应的记录
        a_a = p.page(p.num_pages)      # 取最后一页的记录
        page1 = p.page(p.num_pages)
        page_list = page1.object_list

    return render(request, 'user_management.html',
                  {
                      'username': username,
                      'page_list': page_list,
                      'second_list_obj': a_a,
                      'p': p,
                  })


def res_management_page(request):
    if not login_check(request):
        return redirect("admin_login")
    username = '管理员'
    p = Paginator(Resource.objects.all().order_by('-res_id'), 20)
    page = request.GET.get('page')  # 获取页码
    if page:
        pass
    else:
        page = 1
    try:
        a_a = p.page(page)  # 获取某页对应的记录
        page1 = p.page(page)
        page_list = page1.object_list
    except PageNotAnInteger:  # 如果页码不是个整数
        a_a = p.page(1)  # 取第一页的记录
        page1 = p.page(1)
        page_list = page1.object_list
    except EmptyPage:  # 如果页码太大，没有相应的记录
        a_a = p.page(p.num_pages)  # 取最后一页的记录
        page1 = p.page(p.num_pages)
        page_list = page1.object_list

    return render(request, 'res_management.html',
                  {
                      'username': username,
                      'page_list': page_list,
                      'second_list_obj': a_a,
                      'p': p,
                  })


def logout_request(request):
    logout(request)
    return redirect("/admin_login")


def login_check(request):
    # 判断是否已登录
    sessionid = request.COOKIES.get('sessionid', None)
    if sessionid is None:
        return False
    print(sessionid)
    print(Session.objects.all())
    sess = Session.objects.filter(pk=sessionid)
    print(sess)
    print(request.user.username)
    if sess is not None:
        # if request.COOKIES.get('is_login','') != True:
        # 避免重复登陆：一个sessionid值对应一个会话
        return True
    return False


def delete_record(request):
    id_list = request.POST.getlist('id_list[]')
    print(request.POST)
    print(id_list)

    for each in id_list:
        try:
            UserInfo.objects.get(id=each).delete()
        except:
            return HttpResponse("fail")

    return HttpResponse("ok")


def delete_res(request):
    id_list = request.POST.getlist('id_list[]')
    print(request.POST)
    print(id_list)

    for res_id in id_list:
        pass
