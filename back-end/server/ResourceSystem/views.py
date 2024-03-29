import json
import os
import time,datetime
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Resource
from .config import administration_config
from utils.get_username import get_username 
from utils.get_entrynum import get_entrynum
from utils.get_interest_category import get_interest_category

# Create your views here.
def add_res(request):
    '''
    用于用户提交新的资源
    :param request:
    :return:
    '''
    post_body = request.body
    json_request = json.loads(post_body)
    session_code = json_request['sessionCode']
    if session_code is None:
        res = HttpResponse()
        res.status_code = 404
        return res
#    if session_code != administration_config['session_code']:
#        res = HttpResponse()
#        res.status_code = 404
#        return res
    title = json_request['title']
    content = json_request['content']
    due = json_request['due']
    contact = json_request['contact']
    openid = json_request['openid']
    category = json_request['category']
    cover_img = json_request['coverImg']
    img_arr = json_request['imgArr']
    tag_arr = json_request['tagArr']
    name = get_username(openid)
    imgs = ''
    tags = ''
    for item in img_arr:
        imgs = imgs + item + ','
    for item in tag_arr:
        tags = tags + item + ','
    imgs = imgs[:-1]
    tags = tags[:-1]
    resource = Resource.objects.create()
    resource.openid = openid
    resource.title = title
    resource.content = content
    resource.due = due
    resource.contact = contact
    resource.cover_img = cover_img
    resource.img_arr = imgs
    resource.tag_arr = tags
    resource.name = name
    resource.category = category
    resource.save()
    res = HttpResponse()
    res.status_code = 200
    return res


def delete_res(request):
    '''
    用于用户删除资源
    :param request:
    :return:
    '''
    post_body = request.body
    json_request = json.loads(post_body)
    session_code = json_request['sessionCode']
    if session_code is None:
        res = HttpResponse()
        res.status_code = 404
        return res
#    if session_code != administration_config['session_code']:
#        res = HttpResponse()
#        res.status_code = 404
#        return res
    openid = json_request['openid']
    res_id = json_request['resID']
    try:
        resource = Resource.objects.filter(res_id=res_id)[0]
    except Exception as e:
        print(e)
        res = HttpResponse()
        res.status_code = 404
        return res
    if not resource.openid == openid:
        res = HttpResponse()
        res.status_code = 404
        print("error: user invalid!")
        return res
    try:
        res_imgs = resource.img_arr.split(',')
        if os.path.exists(resource.cover_img):
            os.remove(str(resource.cover_img)[1:])
        for item in res_imgs:
            if os.path.exists(item):
                os.remove(str(item)[1:])
        resource.delete()
        res = HttpResponse()
        res.status_code = 200
        return res
    except Exception as e:
        print(e)
        res = HttpResponse()
        res.status_code = 404
        return res 


def modify_res(request):
    '''
    用于用户修改现有的资源
    :param request:
    :return:
    '''
    post_body = request.body
    json_request = json.loads(post_body)
    session_code = json_request['sessionCode']
    if session_code is None:
        res = HttpResponse()
        res.status_code = 404
        return res
#    if session_code != administration_config['session_code']:
#        res = HttpResponse()
#        res.status_code = 404
#        return res
    openid = json_request['openid']
    res_id = json_request['resID']
    try:
        resource = Resource.objects.filter(res_id=res_id)[0]
    except Exception as e:
        print(e)
        res = HttpResponse()
        res.status_code = 404
        return res
    if not resource.openid == openid:
        res = HttpResponse()
        res.status_code = 404
        print("error: user invalid!")
        return res
    title = json_request['title']
    content = json_request['content']
    cover_img =json_request['coverImg']
    due = json_request['due']
    contact = json_request['contact']
    category = json_request['category']
    img_arr = json_request['imgArr']
    tag_arr = json_request['tagArr']
    imgs = ''
    tags = ''
    for item in img_arr:
        imgs = imgs + item + ','
    for item in tag_arr:
        tags = tags + item + ','
    imgs = imgs[:-1]
    tags = tags[:-1]
    resource.title = title
    resource.content = content
    resource.cover_img = cover_img
    resource.due = due
    resource.contact = contact
    resource.img_arr = imgs
    resource.tag_arr = tags
    resource.category = category
    resource.save()
    res = HttpResponse()
    res.status_code = 200
    return res


def view_res(request):
    '''
    用于用户查看资源详情
    :param request:
    :return:
    '''
    post_body = request.body
    json_request = json.loads(post_body)
    session_code = json_request['sessionCode']
    if session_code is None:
        res = HttpResponse()
        res.status_code = 404
        return res
#    if session_code != administration_config['session_code']:
#        res = HttpResponse()
#        res.status_code = 404
#        return res
    openid = json_request['openid']
    res_id = json_request['resID']
    try:
        resource = Resource.objects.filter(res_id=res_id)[0]
    except Exception as e:
        print(e)
        res = HttpResponse()
        res.status_code = 404
        return res
    resource.view_num += 1
    resource.save()
    isInterested = False
    interest_arr = resource.interest_users.split(",")
    if resource.interest_users == '':
        interest_num = 0
    else:
        interest_num = len(interest_arr)
    if openid in interest_arr:
        isInterested = True
    tss1 = resource.due + ' 23:59:59'
    res_time_array = time.strptime(tss1, "%Y/%m/%d %H:%M:%S")
    res_time_stamp = int(time.mktime(res_time_array))
    cur_time_stamp = int(time.time())
    return JsonResponse({
    "openid": str(resource.openid),
    "title": str(resource.title),
    "content": str(resource.content),
    "due": str(resource.due),
    "coverImg": str(resource.cover_img),
    "tagArr": resource.tag_arr.split(","),
    "category": str(resource.category),
    "contact": str(resource.contact),
    "imgArr": resource.img_arr.split(","),
    "name": resource.name,
    "resID": str(resource.res_id),
    "isInterested": isInterested,
    'interestNum': str(interest_num),
    'viewNum': str(resource.view_num),
    'overdue': cur_time_stamp>res_time_stamp})


def query_res_all(request):
    '''
    用于用户查看所有发布资源
    :param request:
    :return:
    '''
    post_body = request.body
    json_request = json.loads(post_body)
    session_code = json_request['sessionCode']
    if session_code is None:
        res = HttpResponse()
        res.status_code = 404
        return res
#    if session_code != administration_config['session_code']:
#        res = HttpResponse()
#        res.status_code = 404
#        return res
    openid = json_request['openid']
    resources = Resource.objects.filter()
    res_list = []
    res_list_overdue = []
    cur_time_stamp = int(time.time())
    for e in resources:
        interest_list = e.interest_users.split(",")
        res_time_array = time.strptime(e.due+' 23:59:59', "%Y/%m/%d %H:%M:%S")
        res_time_stamp = int(time.mktime(res_time_array))
        tmp = {}
        tmp['title'] = e.title
        tmp['name'] = e.name
        tmp['createTime'] = e.c_time
        tmp['imgUrl'] = e.img_arr.split(",")
        tmp['coverImg'] = e.cover_img
        tmp['tags'] = e.tag_arr.split(",")
        tmp['category'] = e.category
        tmp['contact'] = e.contact
        tmp['due'] = e.due
        tmp['resID'] = e.res_id
        tmp['interested'] = openid in interest_list
        if res_time_stamp<cur_time_stamp:  #已过期
            res_list_overdue.append(tmp)
            tmp['overdue'] = True
        else:
            res_list.append(tmp)
            tmp['overdue'] = False
    res_list += res_list_overdue
    return JsonResponse({"res_list": res_list})

def query_res_official(request):
    '''
    用于返回官方发布的资源
    :param request:
    :return:
    '''
    post_body = request.body
    json_request = json.loads(post_body)
    session_code = json_request['sessionCode']
    if session_code is None:
        res = HttpResponse()
        res.status_code = 404
        return res
#    if session_code != administration_config['session_code']:
#        res = HttpResponse()
#        res.status_code = 404
#        return res
    openid = json_request['openid']
    resources = Resource.objects.filter(name = "思源官方")
    res_list = []
    res_list_overdue = []
    cur_time_stamp = int(time.time())
    for e in resources:
        interest_list = e.interest_users.split(",")
        res_time_array = time.strptime(e.due+' 23:59:59', "%Y/%m/%d %H:%M:%S")
        res_time_stamp = int(time.mktime(res_time_array))
        tmp = {}
        tmp['title'] = e.title
        tmp['name'] = e.name
        tmp['createTime'] = e.c_time
        tmp['imgUrl'] = e.img_arr.split(",")
        tmp['coverImg'] = e.cover_img
        tmp['tags'] = e.tag_arr.split(",")
        tmp['category'] = e.category
        tmp['contact'] = e.contact
        tmp['due'] = e.due
        tmp['resID'] = e.res_id
        tmp['interested'] = openid in interest_list
        if res_time_stamp<cur_time_stamp:  #已过期
            res_list_overdue.append(tmp)
            tmp['overdue'] = True
        else:
            res_list.append(tmp)
            tmp['overdue'] = False
    res_list += res_list_overdue
    return JsonResponse({"res_list": res_list})

def recommend_res(request):
    '''
    用于给用户推荐内容
    :param request:
    :return:
    '''
    post_body = request.body
    json_request = json.loads(post_body)
    session_code = json_request['sessionCode']
    if session_code is None:
        res = HttpResponse()
        res.status_code = 404
        return res
#    if session_code != administration_config['session_code']:
#        res = HttpResponse()
#        res.status_code = 404
#        return res
    openid = json_request['openid']
    #entry_num = int(get_entrynum(openid))
    interest_category = get_interest_category(openid).split(',')
    res_list = []
    res_list_overdue = []
    cur_time_stamp = int(time.time())
    resources = Resource.objects.filter()
    for e in resources:
        if e.category in interest_category:
            interest_list = e.interest_users.split(",")
            res_time_array = time.strptime(e.due+' 23:59:59', "%Y/%m/%d %H:%M:%S")
            res_time_stamp = int(time.mktime(res_time_array))
            tmp = {}
            tmp['title'] = e.title
            tmp['name'] = e.name
            tmp['createTime'] = e.c_time
            tmp['imgUrl'] = e.img_arr.split(",")
            tmp['coverImg'] = e.cover_img
            tmp['tags'] = e.tag_arr.split(",")
            tmp['category'] = e.category
            tmp['contact'] = e.contact
            tmp['due'] = e.due
            tmp['resID'] = e.res_id
            tmp['interested'] = openid in interest_list
            if res_time_stamp<cur_time_stamp:  #已过期
                res_list_overdue.append(tmp)
                tmp['overdue'] = True
            else:
                res_list.append(tmp)
                tmp['overdue'] = False
    res_list += res_list_overdue
    return JsonResponse({"res_list": res_list})

def query_res_issued(request):
    '''
    用于用户查看自己发布的资源
    :param request:
    :return:
    '''
    post_body = request.body
    json_request = json.loads(post_body)
    session_code = json_request['sessionCode']
    if session_code is None:
        res = HttpResponse()
        res.status_code = 404
        return res
#    if session_code != administration_config['session_code']:
#        res = HttpResponse()
#        res.status_code = 404
#        return res
    openid = json_request['openid']
    resources = Resource.objects.filter(openid=openid)
    res_list = []
    res_list_overdue = []
    cur_time_stamp = int(time.time())
    for e in resources:
        interest_list = e.interest_users.split(",")
        res_time_array = time.strptime(e.due+' 23:59:59', "%Y/%m/%d %H:%M:%S")
        res_time_stamp = int(time.mktime(res_time_array))
        tmp = {}
        tmp['title'] = e.title
        tmp['name'] = e.name
        tmp['createTime'] = e.c_time
        tmp['imgUrl'] = e.img_arr.split(",")
        tmp['coverImg'] = e.cover_img
        tmp['tags'] = e.tag_arr.split(",")
        tmp['category'] = e.category
        tmp['contact'] = e.contact
        tmp['due'] = e.due
        tmp['resID'] = e.res_id
        tmp['interested'] = openid in interest_list
        if res_time_stamp<cur_time_stamp:  #已过期
            res_list_overdue.append(tmp)
            tmp['overdue'] = True
        else:
            res_list.append(tmp)
            tmp['overdue'] = False
    res_list += res_list_overdue
    return JsonResponse({"res_list": res_list})
    

def query_res_by_openid(request):
    '''
    根据target_openid查看资源
    :param request:
    :return:
    '''
    post_body = request.body
    json_request = json.loads(post_body)
    session_code = json_request['sessionCode']
    if session_code is None:
        res = HttpResponse()
        res.status_code = 404
        return res
#    if session_code != administration_config['session_code']:
#        res = HttpResponse()
#        res.status_code = 404
#        return res
    openid = json_request['openid']
    target_openid = json_request['targetOpenid']
    resources = Resource.objects.filter(openid=target_openid)
    res_list = []
    res_list_overdue = []
    cur_time_stamp = int(time.time())
    for e in resources:
        interest_list = e.interest_users.split(",")
        res_time_array = time.strptime(e.due+' 23:59:59', "%Y/%m/%d %H:%M:%S")
        res_time_stamp = int(time.mktime(res_time_array))
        tmp = {}
        tmp['title'] = e.title
        tmp['name'] = e.name
        tmp['createTime'] = e.c_time
        tmp['imgUrl'] = e.img_arr.split(",")
        tmp['coverImg'] = e.cover_img
        tmp['tags'] = e.tag_arr.split(",")
        tmp['category'] = e.category
        tmp['contact'] = e.contact
        tmp['due'] = e.due
        tmp['resID'] = e.res_id
        tmp['interested'] = openid in interest_list
        if res_time_stamp<cur_time_stamp:  #已过期
            res_list_overdue.append(tmp)
            tmp['overdue'] = True
        else:
            res_list.append(tmp)
            tmp['overdue'] = False
    res_list += res_list_overdue
    return JsonResponse({"res_list": res_list})


def query_res_by_category_tags(request):
    '''
    根据category和tags查看资源
    :param request:
    :return:
    '''
    post_body = request.body
    json_request = json.loads(post_body)
    session_code = json_request['sessionCode']
    if session_code is None:
        res = HttpResponse()
        res.status_code = 404
        return res
#    if session_code != administration_config['session_code']:
#        res = HttpResponse()
#        res.status_code = 404
#        return res
    openid = json_request['openid']
    category = json_request['category']
    target_tags = json_request['tagArr']
    if category == "":
        resources = Resource.objects.filter()
    else:
        resources = Resource.objects.filter(category=category)
    res_list = []
    res_list_overdue = []
    cur_time_stamp = int(time.time())
    for e in resources:
        tags = e.tag_arr.split(",")
        flag = True
        for tag in target_tags:
            if not tag in tags:
                flag = False
        if flag:
            interest_list = e.interest_users.split(",")
            res_time_array = time.strptime(e.due+' 23:59:59', "%Y/%m/%d %H:%M:%S")
            res_time_stamp = int(time.mktime(res_time_array))
            tmp = {}
            tmp['title'] = e.title
            tmp['name'] = e.name
            tmp['createTime'] = e.c_time
            tmp['imgUrl'] = e.img_arr.split(",")
            tmp['coverImg'] = e.cover_img
            tmp['tags'] = e.tag_arr.split(",")
            tmp['category'] = e.category
            tmp['contact'] = e.contact
            tmp['due'] = e.due
            tmp['resID'] = e.res_id
            tmp['interested'] = openid in interest_list
            if res_time_stamp<cur_time_stamp:  #已过期
                res_list_overdue.append(tmp)
                tmp['overdue'] = True
            else:
                res_list.append(tmp)
                tmp['overdue'] = False
    res_list += res_list_overdue
    return JsonResponse({"res_list": res_list})

def query_res_by_category(request):
    '''
    根据category查看资源
    :param request:
    :return:
    '''
    post_body = request.body
    json_request = json.loads(post_body)
    session_code = json_request['sessionCode']
    if session_code is None:
        res = HttpResponse()
        res.status_code = 404
        return res
#    if session_code != administration_config['session_code']:
#        res = HttpResponse()
#        res.status_code = 404
#        return res
    openid = json_request['openid']
    category = json_request['category']
    resources = Resource.objects.filter(category=category)
    res_list = []
    res_list_overdue = []
    cur_time_stamp = int(time.time())
    for e in resources:
        interest_list = e.interest_users.split(",")
        res_time_array = time.strptime(e.due+' 23:59:59', "%Y/%m/%d %H:%M:%S")
        res_time_stamp = int(time.mktime(res_time_array))
        tmp = {}
        tmp['title'] = e.title
        tmp['name'] = e.name
        tmp['createTime'] = e.c_time
        tmp['imgUrl'] = e.img_arr.split(",")
        tmp['coverImg'] = e.cover_img
        tmp['tags'] = e.tag_arr.split(",")
        tmp['category'] = e.category
        tmp['contact'] = e.contact
        tmp['due'] = e.due
        tmp['resID'] = e.res_id
        tmp['interested'] = openid in interest_list
        if res_time_stamp<cur_time_stamp:  #已过期
            res_list_overdue.append(tmp)
            tmp['overdue'] = True
        else:
            res_list.append(tmp)
            tmp['overdue'] = False
    res_list += res_list_overdue
    return JsonResponse({"res_list": res_list})

def query_res_by_tags(request):
    '''
    根据tags查看资源
    :param request:
    :return:
    '''
    post_body = request.body
    json_request = json.loads(post_body)
    session_code = json_request['sessionCode']
    if session_code is None:
        res = HttpResponse()
        res.status_code = 404
        return res
#    if session_code != administration_config['session_code']:
#        res = HttpResponse()
#        res.status_code = 404
#        return res
    openid = json_request['openid']
    target_tags = json_request['tagArr']
    resources = Resource.objects.filter()
    res_list = []
    res_list_overdue = []
    cur_time_stamp = int(time.time())
    for e in resources:
        tags = e.tag_arr.split(",")
        flag = True
        for tag in target_tags:
            if not tag in tags:
                flag = False
        if flag:
            interest_list = e.interest_users.split(",")
            res_time_array = time.strptime(e.due+' 23:59:59', "%Y/%m/%d %H:%M:%S")
            res_time_stamp = int(time.mktime(res_time_array))
            tmp = {}
            tmp['title'] = e.title
            tmp['name'] = e.name
            tmp['createTime'] = e.c_time
            tmp['imgUrl'] = e.img_arr.split(",")
            tmp['coverImg'] = e.cover_img
            tmp['tags'] = e.tag_arr.split(",")
            tmp['category'] = e.category
            tmp['contact'] = e.contact
            tmp['due'] = e.due
            tmp['resID'] = e.res_id
            tmp['interested'] = openid in interest_list
            if res_time_stamp<cur_time_stamp:  #已过期
                res_list_overdue.append(tmp)
                tmp['overdue'] = True
            else:
                res_list.append(tmp)
                tmp['overdue'] = False
    res_list += res_list_overdue
    return JsonResponse({"res_list": res_list})


def serch_res(request):
    '''
    根据关键词搜索资源
    :param request:
    :return:
    '''
    post_body = request.body
    json_request = json.loads(post_body)
    session_code = json_request['sessionCode']
    if session_code is None:
        res = HttpResponse()
        res.status_code = 404
        return res
#    if session_code != administration_config['session_code']:
#        res = HttpResponse()
#        res.status_code = 404
#        return res
    openid = json_request['openid']
    search_content = json_request['content'].strip()
    resources = Resource.objects.filter()
    res_list = []
    res_list_overdue = []
    cur_time_stamp = int(time.time())
    for e in resources:
        if search_content in e.title or search_content in e.content:
            interest_list = e.interest_users.split(",")
            res_time_array = time.strptime(e.due+' 23:59:59', "%Y/%m/%d %H:%M:%S")
            res_time_stamp = int(time.mktime(res_time_array))
            tmp = {}
            tmp['title'] = e.title
            tmp['name'] = e.name
            tmp['createTime'] = e.c_time
            tmp['imgUrl'] = e.img_arr.split(",")
            tmp['coverImg'] = e.cover_img
            tmp['tags'] = e.tag_arr.split(",")
            tmp['category'] = e.category
            tmp['contact'] = e.contact
            tmp['due'] = e.due
            tmp['resID'] = e.res_id
            tmp['interested'] = openid in interest_list
            if res_time_stamp<cur_time_stamp:  #已过期
                res_list_overdue.append(tmp)
                tmp['overdue'] = True
            else:
                res_list.append(tmp)
                tmp['overdue'] = False
    res_list += res_list_overdue
    return JsonResponse({"res_list": res_list})

def query_res_interested(request):
    '''
    用于用户查看感兴趣的资源
    :param request:
    :return:
    '''
    post_body = request.body
    json_request = json.loads(post_body)
    session_code = json_request['sessionCode']
    if session_code is None:
        res = HttpResponse()
        res.status_code = 404
        return res
#    if session_code != administration_config['session_code']:
#        res = HttpResponse()
#        res.status_code = 404
#        return res
    openid = json_request['openid']
    resources = Resource.objects.filter()
    res_list = []
    res_list_overdue = []
    cur_time_stamp = int(time.time())
    for e in resources:
        interest_list = e.interest_users.split(",")
        if openid in interest_list:
            res_time_array = time.strptime(e.due+' 23:59:59', "%Y/%m/%d %H:%M:%S")
            res_time_stamp = int(time.mktime(res_time_array))
            tmp = {}
            tmp['title'] = e.title
            tmp['name'] = e.name
            tmp['createTime'] = e.c_time
            tmp['imgUrl'] = e.img_arr.split(",")
            tmp['coverImg'] = e.cover_img
            tmp['tags'] = e.tag_arr.split(",")
            tmp['category'] = e.category
            tmp['contact'] = e.contact
            tmp['due'] = e.due
            tmp['resID'] = e.res_id
            tmp['interested'] = True
            if res_time_stamp<cur_time_stamp:  #已过期
                res_list_overdue.append(tmp)
                tmp['overdue'] = True
            else:
                res_list.append(tmp)
                tmp['overdue'] = False
    res_list += res_list_overdue
    return JsonResponse({"res_list": res_list})

def switch_interest(request):
    '''
    用于用户切换感兴趣状态
    :param request:
    :return:
    '''
    post_body = request.body
    json_request = json.loads(post_body)
    session_code = json_request['sessionCode']
    if session_code is None:
        res = HttpResponse()
        res.status_code = 404
        return res
#    if session_code != administration_config['session_code']:
#        res = HttpResponse()
#        res.status_code = 404
#        return res
    openid = json_request['openid']
    res_id = json_request['resID']
    try:
        resource = Resource.objects.filter(res_id=res_id)[0]
    except Exception as e:
        print(e)
        res = HttpResponse()
        res.status_code = 404
        return res
    if resource.interest_users=='':
        interest_arr = []
    else:
        interest_arr = resource.interest_users.split(",")
    if openid in interest_arr:
        interest_arr.remove(openid)
    else:
        interest_arr.append(openid)
    interests = ''
    for item in interest_arr:
        interests = interests + item + ","
    interests = interests[:-1]
    resource.interest_users = interests
    resource.save()
    print(resource.interest_users)
    res = HttpResponse()
    res.status_code = 200
    return res
