from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Resource
import json
import os
from .config import administration_config


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
    if session_code != administration_config['session_code']:
        res = HttpResponse()
        res.status_code = 404
        return res
    title = json_request['title']
    content = json_request['content']
    due = json_request['due']
    contact = json_request['contact']
    openid = json_request['openid']
    img_arr = json_request['imgArr']
    imgs = ''
    for item in img_arr:
        imgs = imgs + item + ','
    imgs = imgs[:-1]
    resource = Resource.objects.create()
    resource.openid = openid
    resource.title = title
    resource.content = content
    resource.due = due
    resource.contact = contact
    resource.img_arr = imgs
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
    if session_code != administration_config['session_code']:
        res = HttpResponse()
        res.status_code = 404
        return res
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
        for item in res_imgs:
            if os.path.exists(item):
                os.remove(str(item))
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
    if session_code != administration_config['session_code']:
        res = HttpResponse()
        res.status_code = 404
        return res
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
    due = json_request['due']
    contact = json_request['contact']
    img_arr = json_request['imgArr']
    imgs = ''
    for item in img_arr:
        imgs = imgs + item + ','
    imgs = imgs[:-1]
    resource.title = title
    resource.content = content
    resource.due = due
    resource.contact = contact
    resource.img_arr = imgs
    resource.save()
    res = HttpResponse()
    res.status_code = 200
    return res

def view_res(request):
    '''
    用于用户查看现有的资源
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
    if session_code != administration_config['session_code']:
        res = HttpResponse()
        res.status_code = 404
        return res
    openid = json_request['openid']
    res_id = json_request['resID']
    try:
        resource = Resource.objects.filter(res_id=res_id)[0]
    except Exception as e:
        print(e)
        res = HttpResponse()
        res.status_code = 404
        return res
    return JsonResponse({
    "openid": str(resource.openid),
    "title": str(resource.title),
    "content": str(resource.content),
    "due": str(resource.due),
    "contact": str(resource.contact),
    "imgArr": resource.img_arr.split(",")})
