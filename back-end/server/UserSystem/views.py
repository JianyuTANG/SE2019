from django.shortcuts import render
from django.http import HttpResponse
from .models import User, UserInfo
from .utils import *
import json
from .forms import *
import os
from .config import administration_config


def login(request):
    print('/login')
    post_body = request.body
    try:
        json_request = json.loads(post_body)
        code = json_request['code']
    except:
        print('json请求解析错误')
        return get404()

    login_status = authenticator(code)

    if 'errcode' in login_status.keys():
        print('微信验证失败，发生错误')
        res = {
            'sessionCode': '0',
            'identity': -1
        }
        response = HttpResponse(json.dumps(res), content_type="application/json")
        response.status_code = 404
        return response

    try:
        openid = login_status['openid']
        session_key = login_status['session_key']
    except:
        print('json请求解析错误')
        return get404()

    try:
        user = User.objects.get(openid=openid)
        user.session_key = session_key
        user.save()
    except:
        user = User.objects.create(openid=openid)
        user.openid = openid
        user.session_key = session_key
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
    print('/verify')
    post_body = request.body
    try:
        json_request = json.loads(post_body)
        user = get_user(json_request['sessionCode'])
    except:
        print('json请求解析错误')
        return get404()

    if user is None:
        # 用户不存在 （sessionCode有误）
        print('sessioncode有误')
        res = {'result': -1}
        response = HttpResponse(json.dumps(res), content_type="application/json")
        response.status_code = 200
        return response

    try:
        name = json_request['name']
        num = json_request['num']
        classmate = json_request['classmate']
        advisor = json_request['advisor']
        student_type = json_request['identity']
    except:
        print('json请求解析错误')
        return get404()

    res = {'result': -1}

    if student_type == 0:
        # 学生类型注册
        userinfo = verify_student_identity(name, num, classmate, advisor)
        if userinfo is not None:
            res['result'] = 0
            userinfo.avatar_url = '/media/user_avatar/default/default.jpg'
            user.info = userinfo
            userinfo.is_connected = 1
            userinfo.save()
            user.logon_status = 0
            user.save()
    elif student_type == 1:
        # 辅导员类型注册
        userinfo = verify_advisor_identity(name, num, classmate, advisor)
        if userinfo is not None:
            res['result'] = 0
            userinfo.avatar_url = '/media/user_avatar/default/default.jpg'
            user.info = userinfo
            userinfo.is_connected = 1
            userinfo.save()
            user.logon_status = 1
            user.save()
    response = HttpResponse(json.dumps(res), content_type="application/json")
    response.status_code = 200
    return response


def invite(request):
    print('/invite')
    post_body = request.body
    try:
        json_request = json.loads(post_body)
        user = get_user(json_request['sessionCode'])
    except:
        print('json请求解析错误')
        return get404()

    if user is None:
        # 用户不存在 （sessionCode有误） 直接404
        print('sessionCode有误')
        return get404()
    res = {'result': -1}
    invitation_code = json_request['invitation_code']
    if verify_invitation(invitation_code) != 0:
        res['result'] = 0
    response = HttpResponse(json.dumps(res), content_type="application/json")
    response.status_code = 200
    return response


def register(request):
    '''

    :param request:
    :return: if succeed, return HTTP status code 200
             else return HTTP status code 404

    已修改为将User和UserInfo拆开的版本
    '''
    print('/basic_user_info')
    post_body = request.body
    try:
        json_request = json.loads(post_body)
        user = get_user(json_request['sessionCode'])
    except:
        print('json请求解析错误')
        return get404()

    if user is None:
        # 用户不存在 （sessionCode有误） 直接404
        print('sessionCode有误')
        return get404()
    if user.info is None:
        # 用户信息不存在 直接404
        print('未通过验证')
        return get404()

    try:
        city = json_request['city']
        field = json_request['field']
        department = json_request['department']
        wechat_id = json_request['wechatId']
    except:
        print('json请求解析错误')
        return get404()

    userinfo = user.info
    userinfo.city = city
    userinfo.field = field
    userinfo.department = department
    userinfo.wechatid = wechat_id
    userinfo.save()
    user.save()

    response = HttpResponse()
    response.status_code = 200
    return response


def modify_user(request):
    print('/modify_user_info')
    post_body = request.body
    try:
        json_request = json.loads(post_body)
        user = get_user(json_request['sessionCode'])
    except:
        print('json请求解析错误')
        return get404()

    if user is None:
        # 用户不存在 （sessionCode有误） 直接404
        print('sessionCode有误')
        return get404()
    if user.info is None:
        # 用户信息不存在 直接404
        print('未通过验证')
        return get404()

    try:
        city = json_request['city']
        field = json_request['field']
        department = json_request['department']
        wechat_id = json_request['wechatId']
        tel = json_request['tel']
        email = json_request['email']
        self_discription = json_request['selfDiscription']
        hobby = json_request['hobby']
        company = json_request['company']
    except:
        print('json请求解析错误')
        return get404()

    userinfo = user.info
    userinfo.city = city
    userinfo.field = field
    userinfo.department = department
    userinfo.wechatid = wechat_id
    userinfo.tel = tel
    userinfo.email = email
    userinfo.hobby = hobby
    userinfo.company = company
    userinfo.self_discription = self_discription
    userinfo.save()
    user.save()

    response = HttpResponse()
    response.status_code = 200
    return response


def query_user(request):
    print('/view_user')
    post_body = request.body
    try:
        json_request = json.loads(post_body)
        user = get_user(json_request['sessionCode'])
    except:
        print('json请求解析错误')
        return get404()

    if user is None:
        # 用户不存在 （sessionCode有误） 直接404
        print('sessioncode校验失败')
        return get404()

    userinfo = user.info
    if userinfo is None:
        # 未绑定到userinfo 返回404
        print('该微信用户尚未注册')
        return get404()

    
    res = {
        'name': userinfo.real_name,
        'num': userinfo.number_of_entry,
        'identity': user.logon_status,
        'city': userinfo.city,
        'field': userinfo.field,
        'department': userinfo.department,
        'wechatID': userinfo.wechatid,
        'tel': userinfo.tel,
        'email': userinfo.email,
        'selfDiscription': userinfo.self_discription,
        'company': userinfo.company,
        'hobby': userinfo.hobby,
    }
    response = HttpResponse(json.dumps(res), content_type="application/json")
    response.status_code = 200
    return response


def upload_user_avatar(request):
    print('upload_user_avatar')
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
    if user.info is None:
        # 用户信息不存在 直接404
        response = HttpResponse()
        response.status_code = 404
        return response
    if request.method == 'POST':
        files = request.FILES
        for key, values in files.items():
            img_obj = values
            # img_obj = request.FILES.get('img')
            # 获取存放路径
            src = './media/user_avatar/'
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
            src = os.path.join('/media/user_avatar/', img_name)
            userinfo = user.info
            userinfo.avatar_url = src
            userinfo.save()
            user.save()
            res = {'url': src}
            response = HttpResponse(json.dumps(res), content_type="application/json")
            response.status_code = 200
            return response

    response.status_code = 404
    return response


def get_user_avartar(request):
    print('/get_user_avatar')
    post_body = request.body
    try:
        json_request = json.loads(post_body)
        user = get_user(json_request['sessionCode'])
    except:
        print('json请求解析错误')
        return get404()

    if user is None:
        # 用户不存在 （sessionCode有误） 直接404
        print('sessionCode有误')
        return get404()
    if user.info is None:
        # 用户信息不存在 直接404
        print('未通过验证')
        return get404()

    src = user.info.avatar_url
    if os.path.isfile('.' + src):
        res = {'url': src}
        response = HttpResponse(json.dumps(res), content_type="application/json")
        response.status_code = 200
        return response
    return get404()


def create_userinfo(request):
    '''
    用于管理员在用户信息表中预制用户信息（用来验证等）

    :param request:
    :return:
    '''
    post_body = request.body
    try:
        json_request = json.loads(post_body)
    except:
        print('json请求解析错误')
        return get404()
    session_code = json_request['sessionCode']
    if session_code is None:
        print('sessionCode有误')
        return get404()
    if session_code != administration_config['session_code']:
        print('未通过验证')
        return get404()

    name = json_request['name']
    num = json_request['num']
    department = json_request['department']
    city = json_request['city']
    userinfo = UserInfo.objects.create()
    userinfo.real_name = name
    userinfo.department = department
    userinfo.number_of_entry = num
    userinfo.city = city
    userinfo.save()
    res = HttpResponse()
    res.status_code = 200
    return res
