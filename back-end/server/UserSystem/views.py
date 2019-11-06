from django.shortcuts import render
from django.http import HttpResponse
from .models import User
from .utils import *
import json
from .forms import *
import os


def login(request):
    post_body = request.body
    json_request = json.loads(post_body)
    code = json_request['code']
    login_status = authenticator(code)
    openid = login_status['openid']
    session_key = login_status['session_key']
    if login_status['errcode'] == 0:
        pass
    else:
        res = {'sessionCode': '0',
               'identity': -1}
        response = HttpResponse(json.dumps(res), content_type="application/json")
        response.status_code = 404
        return response
    user = User.objects.get(openid=openid)
    if user is None:
        user = User.objects.create()
        user.openid = openid
        user.logon_status = -1
        user.save()
    logon_status = user.logon_status
    hashed = status_hash(openid, session_key)
    res = {'sessionCode': hashed,
           'identity': logon_status}
    response = HttpResponse(json.dumps(res), content_type="application/json")
    response.status_code = 200
    return response

def verify(request):
    post_body = request.body
    json_request = json.loads(post_body)
    openid, hashed_session = status_dehash(json_request.sessionCode)
    user = User.objects.get(openid=openid)
    if user is None:
        # 用户不存在 （sessionCode有误） 直接404
        res = {'result': -1}
        response = HttpResponse(json.dumps(res), content_type="application/json")
        response.status_code = 404
        return response
    name = json_request.name
    num = json_request.num
    classmate = json_request.classmate
    advisor = json_request.advisor
    student_type = json_request.identity
    res = {'result': -1}
    if student_type == 0 and verify_student_identity(name, num, classmate, advisor) != 0:
        # 学生类型注册
        res.result = 0
        user.real_name = name
        user.number_of_entry = num
        user.save()
    elif student_type == 1 and verify_teacher_identity(name, num, classmate, advisor) != 0:
        # 辅导员类型注册
        res.result = 0
        user.real_name = name
        user.number_of_entry = num
        user.save()
    response = HttpResponse(json.dumps(res), content_type="application/json")
    response.status_code = 200
    return response


def invite(request):
    post_body = request.body
    json_request = json.loads(post_body)
    openid, hashed_session = status_dehash(json_request.sessionCode)
    user = User.objects.get(openid=openid)
    if user is None:
        # 用户不存在 （sessionCode有误） 直接404
        res = {'result': -1}
        response = HttpResponse(json.dumps(res), content_type="application/json")
        response.status_code = 404
        return response
    res = {'result': -1}
    invitation_code = json_request.invitation_code
    if verify_invitation(invitation_code) != 0:
        res.result = 0
    response = HttpResponse(json.dumps(res), content_type="application/json")
    response.status_code = 200
    return response


def register(request):
    post_body = request.body
    json_request = json.loads(post_body)
    user = get_user(json_request.sessionCode)
    if user is None:
        # 用户不存在 （sessionCode有误） 直接404
        response = HttpResponse()
        response.status_code = 404
        return response
    city = json_request.city
    field = json_request.field
    department = json_request.department
    wechat_id = json_request.wechatId
    user.city = city
    user.field = field
    user.department = department
    user.wechatid = wechat_id
    user.save()
    response = HttpResponse()
    response.status_code = 200
    return response


def modify_user(request):
    post_body = request.body
    json_request = json.loads(post_body)
    user = get_user(json_request.sessionCode)
    if user is None:
        # 用户不存在 （sessionCode有误） 直接404
        response = HttpResponse()
        response.status_code = 404
        return response
    city = json_request.city
    field = json_request.field
    department = json_request.department
    wechat_id = json_request.wechatId
    tel = json_request.tel
    email = json_request.email
    self_discription = json_request.selfDiscription
    user.city = city
    user.field = field
    user.department = department
    user.wechatid = wechat_id
    user.tel = tel
    user.email = email
    user.self_discription = self_discription
    user.save()
    response = HttpResponse()
    response.status_code = 200
    return response


def query_user(request):
    post_body = request.body
    json_request = json.loads(post_body)
    user = get_user(json_request.sessionCode)
    if user is None:
        # 用户不存在 （sessionCode有误） 直接404
        response = HttpResponse()
        response.status_code = 404
        return response
    res = {
        'name': user.real_name,
        'num': user.number_of_entry,
        'identity': user.logon_status,
        'city': user.city,
        'field': user.field,
        'department': user.department,
        'wechatID': user.wechatid,
        'tel': user.tel,
        'email': user.email,
        'selfDiscription': user.self_discription,
    }
    response = HttpResponse(json.dumps(res), content_type="application/json")
    response.status_code = 200
    return response


def upload_user_avatar(request):
    session_code = request.META.get('HTTP_SESSIONCODE')
    response = HttpResponse()
    if session_code is None:
        # 请求头无参数
        response.status_code = 404
        return response
    user = get_user(session_code)
    if user is None:
        # 用户不存在 （sessionCode有误） 直接404
        response.status_code = 404
        return response
    if request.method == 'POST':
        img_obj = request.FILES.get('img')
        # 获取存放路径
        src = './media/user_avatar'
        openid = user.openid
        img_name = openid
        src = os.path.join(src, img_name)
        # 写入服务器
        try:
            f = open(src, 'wb+')
            f.write(img_obj.read())
        except:
            # 写入失败
            response.status_code = 404
            return response
        src = os.path.join('/media/user_avatar', img_name)
        user.avatar_url = src
        user.save()
        res = {'url': src}
        response = HttpResponse(json.dumps(res), content_type="application/json")
        response.status_code = 200
        return response

    response.status_code = 404
    return response


def get_user_avartar(request):
    post_body = request.body
    json_request = json.loads(post_body)
    user = get_user(json_request.sessionCode)
    if user is None:
        # 用户不存在 （sessionCode有误） 直接404
        response = HttpResponse()
        response.status_code = 404
        return response
    src = user.avatar_url
    if os.path.isfile('.' + src):
        res = {'url': src}
        response = HttpResponse(json.dumps(res), content_type="application/json")
        response.status_code = 200
        return response
    response = HttpResponse()
    response.status_code = 404
    return response
