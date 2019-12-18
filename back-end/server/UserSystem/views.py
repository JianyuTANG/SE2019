from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import User, UserInfo, Group_num
from .utils import *
import json
import time
import os
from .config import administration_config
from ResourceSystem.models import Resource


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
           'identity': logon_status,
           'openid': openid}
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
        wechat_id = json_request['wechatId']
        tel = json_request['tel']
        email = json_request['email']
        self_discription = json_request['selfDiscription']
        hobby = json_request['hobby']
        company = json_request['company']
        interest_list = json_request['interestArr']
    except:
        print('json请求解析错误')
        return get404()

    userinfo = user.info
    userinfo.city = city
    userinfo.field = field
    userinfo.wechatid = wechat_id
    userinfo.tel = tel
    userinfo.email = email
    userinfo.hobby = hobby
    userinfo.company = company
    userinfo.self_discription = self_discription
    tempstr = ','
    userinfo.interest_category = tempstr.join(interest_list)
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
    studentArr = []
    advisorArr = []
    nums = userinfo.number_of_entry.split(',')
    if nums[0] != '-1':
        studentArr.append(nums[0])
    nums = nums[1:]
    for i in nums:
        if i != '-1':
            advisorArr.append(i)
    # interestArr = []
    interest_category = userinfo.interest_category.split(',')
    # for interest in interest_category:
    #     interestArr.append(interest)
    res = {
        'name': userinfo.real_name,
        'studentArr': studentArr,
        'advisorArr': advisorArr,
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
        'interestArr': interest_category,
    }
    response = HttpResponse(json.dumps(res), content_type="application/json")
    response.status_code = 200
    return response


def query_other(request):
    print('/view_other')
    post_body = request.body
    try:
        json_request = json.loads(post_body)
        user = get_user(json_request['sessionCode'])
        openid = int(json_request['openid'])
    except:
        print('json请求解析错误')
        return get404()

    if user is None:
        # 用户不存在 （sessionCode有误） 直接404
        print('sessioncode校验失败')
        return get404()

    try:
        userinfo = UserInfo.objects.get(id=openid)
    except:
        res = {'error': 'no such user'}
        response = HttpResponse(json.dumps(res), content_type="application/json")
        return response

    studentArr = []
    advisorArr = []
    nums = userinfo.number_of_entry.split(',')
    if nums[0] != '-1':
        studentArr.append(nums[0])
    nums = nums[1:]
    for i in nums:
        if i != '-1':
            advisorArr.append(i)

    res = {
        'name': userinfo.real_name,
        'studentArr': studentArr,
        'advisorArr': advisorArr,
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
        'avatar_url': userinfo.avatar_url,
    }
    response = HttpResponse(json.dumps(res), content_type="application/json")
    response.status_code = 200
    return response


def query_other_by_openid(request):
    print('/view_other_by_openid')
    post_body = request.body
    try:
        json_request = json.loads(post_body)
        user = get_user(json_request['sessionCode'])
        openid = json_request['openid']
    except:
        print('json请求解析错误')
        return get404()

    if user is None:
        # 用户不存在 （sessionCode有误） 直接404
        print('sessioncode校验失败')
        return get404()

    try:
        user = User.objects.get(openid=openid)
        userinfo = user.info
        if userinfo is None:
            return JsonResponse({'error': 'no such user'})
    except:
        res = {'error': 'no such user'}
        response = HttpResponse(json.dumps(res), content_type="application/json")
        return response

    studentArr = []
    advisorArr = []
    nums = userinfo.number_of_entry.split(',')
    if nums[0] != '-1':
        studentArr.append(nums[0])
    nums = nums[1:]
    for i in nums:
        if i != '-1':
            advisorArr.append(i)

    resArr = []
    res_arr = Resource.objects.filter(openid=openid)
    for res in res_arr:
        resArr.append(int(res.res_id))

    res = {
        'name': userinfo.real_name,
        'studentArr': studentArr,
        'advisorArr': advisorArr,
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
        'avatar_url': userinfo.avatar_url,
        'resArr': resArr,
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


def upload_img(request):
    print('upload_img')
    try:
        session_code = request.META.get('HTTP_SESSIONCODE')
    except:
        print('头信息未包含sessioncode')
        return get404()

    if session_code is None:
        # 请求头无参数
        print('头信息未包含sessioncode')
        return get404()
    user = get_user(session_code)
    if user is None:
        # 用户不存在 （sessionCode有误） 直接404
        print('sessionCode有误')
        return get404()
    if user.info is None:
        # 用户信息不存在 直接404
        print('未通过验证')
        return get404()
    if request.method == 'POST':
        files = request.FILES
        for key, values in files.items():
            img_obj = values
            # img_obj = request.FILES.get('img')
            # 获取存放路径
            src = './media/resource_img/'
            if not os.path.isdir(src):
                os.mkdir(src)
            openid = user.openid
            img_name = openid + '_' + str(int(time.time()))
            src = os.path.join(src, img_name)
            # 写入服务器
            try:
                f = open(src, 'wb+')
                f.write(img_obj.read())
            except:
                # 写入失败
                print('写入失败')
                return get404()
            src = os.path.join('/media/resource_img/', img_name)
            res = {'url': src}
            response = HttpResponse(json.dumps(res), content_type="application/json")
            response.status_code = 200
            return response

    print('post格式错误')
    return get404()


def delete_img(request):
    print('/delete_img')
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

    try:
        src = json_request['src']
    except:
        print('json请求解析错误')
        return get404()

    img_name = src.split('/')
    owner_openid = img_name[-1].split('_')[0]
    if owner_openid == user.openid:
        src = '.' + src
        if os.path.isfile(src):
            try:
                os.remove(src)
            except:
                print('删除失败')
                return get404()

            res = HttpResponse()
            res.status_code = 200
            return res

    print('openid错误或文件不存在')
    return get404()


def query_user_by_num(request):
    print('/query_user_by_num')
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
        num = int(json_request['num'])
    except:
        print('缺失请求参数')
        return get404()

    user_arr = []
    group = Group_num.objects.filter(num=num)
    student_list_id = group.student_list_id.split(',')[:-1]
    user_avatar = []
    for studentid in student_list_id:
        studentid = int(studentid)
        userinfo = UserInfo.objects.get(id=studentid)
        user_avatar.append(userinfo.avatar_url)
    student_list_name = group.student_list_name.split(',')[:-1]
    l = len(student_list_id)
    for i in range(l):
        user_arr.append({
            'name': student_list_name[i],
            'openid': student_list_id[i],
            'avatarUrl': user_avatar[i],
            'isStudent': 1,
        })

    advisor_list_id = group.advisor_list_id.split(',')[:-1]
    user_avatar = []
    for studentid in student_list_id:
        studentid = int(studentid)
        userinfo = UserInfo.objects.get(id=studentid)
        user_avatar.append(userinfo.avatar_url)
    advisor_list_name = group.advisor_list_name.split(',')[:-1]
    l = len(advisor_list_id)
    for i in range(l):
        user_arr.append({
            'name': advisor_list_name[i],
            'openid': advisor_list_id[i],
            'avatarUrl': user_avatar[i],
            'isStudent': 0,
        })
    res = {'userArr': user_arr, 'title': group.title, 'description': group.description}
    response = HttpResponse(json.dumps(res), content_type="application/json")
    response.status_code = 200
    return response


def refresh_group(request):
    print('/refresh_group')
    userinfos = UserInfo.objects.all()
    for userinfo in userinfos:
        if userinfo.is_in_group == 0:
            nums = userinfo.number_of_entry.split(',')
            name = userinfo.real_name
            id = userinfo.id
            # 学生
            try:
                if nums[0] != '-1':
                    n = int(nums[0])
                    try:
                        group = Group_num.objects.get(num=n)
                    except:
                        group = Group_num.objects.create(num=n)
                    group.student_list_id += str(id) + ','
                    group.student_list_name += name + ','
                    group.save()
            except:
                print('part1 error')
            # 辅导员

            try:
                nums = nums[1:]
                for num in nums:
                    if num != '-1':
                        num = int(num)
                        try:
                            group = Group_num.objects.get(num=num)
                        except:
                            group = Group_num.objects.create(num=num)
                        group.advisor_list_id += str(id) + ','
                        group.advisor_list_name += name + ','
                        group.save()
            except:
                print('part2 error')
            userinfo.is_in_group = 1
            userinfo.save()
    return JsonResponse({'result': 'succeed'})


def query_all_num(request):
    print('/query_all_num')
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

    groups = Group_num.objects.filter(num__lte=1000)
    arr = []
    for group in groups:
        item = {}
        item['num'] = group.num
        item['title'] = group.title
        item['description'] = group.description
        studentlist = group.student_list_name.split(',')[:-1]
        item['length'] = len(studentlist)
        advisorlist = group.advisor_list_name.split(',')[:-1]
        item['advisorArr'] = advisorlist
        arr.append(item)
    arr.sort(key=lambda x: x['num'])
    return JsonResponse({
        'arr': arr,
    })


def query_all_fields(request):
    print('/query_group_field')
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

    groups = Group_num.objects.filter(num__gt=1000)
    arr = []
    for group in groups:
        item = {}
        item['num'] = group.num
        item['title'] = group.title
        item['description'] = group.description
        studentlist = group.student_list_name.split(',')[:-1]
        item['length'] = len(studentlist)
        advisorlist = group.advisor_list_name.split(',')[:-1]
        item['advisorArr'] = advisorlist
        arr.append(item)
    arr.sort(key=lambda x: x['num'])
    return JsonResponse({
        'arr': arr,
    })


def query_my_groups(request):
    print('/query_group_mine')
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

    userinfo = user.info
    if userinfo is None:
        print('未验证')
    else:
        print('已验证')
    id = str(userinfo.id)
    grouplist = Group_num.objects.filter(student_list_id__contains=id)
    grouplist2 = Group_num.objects.filter(advisor_list_id__contains=id)
    temp = []
    for group in grouplist:
        if group not in temp:
            temp.append(group)
    for group in grouplist2:
        if group not in temp:
            temp.append(group)
    grouplist = temp
    arr = []
    for group in grouplist:
        studentlist = group.student_list_id.split(',')[:-1]
        studentlist += group.advisor_list_id.split(',')[:-1]
        if id in studentlist:
            item = {}
            item['num'] = group.num
            item['title'] = group.title
            item['description'] = group.description
            item['length'] = len(studentlist)
            advisorlist = group.advisor_list_name.split(',')[:-1]
            item['advisorArr'] = advisorlist
            arr.append(item)
    return JsonResponse({
        'arr': arr,
    })


def get_other_avatar(request):
    print('/get_other_avatar')
    post_body = request.body
    try:
        json_request = json.loads(post_body)
        user = get_user(json_request['sessionCode'])
        openid = json_request['openid']
    except:
        print('json请求解析错误')
        return get404()

    if user is None:
        # 用户不存在 （sessionCode有误） 直接404
        print('sessioncode校验失败')
        return get404()

    try:
        user = User.objects.get(openid=openid)
        userinfo = user.info
    except:
        res = {'error': 'no such user'}
        response = HttpResponse(json.dumps(res), content_type="application/json")
        return response

    return JsonResponse({
        'avatar_url': userinfo.avatar_url,
    })
