from django.shortcuts import render
from django.http import HttpResponse
from .models import Resource
import json
import os
from .utils import *
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
    print(json_request)
    session_code = json_request['sessionCode']
    title = json_request['title']
    content = json_request['content']
    due = json_request['due']
    contact = json_request['contact']
    resource = Resource.objects.create()
    openid, _ = status_dehash(session_code)
    resource.openid = openid
    resource.title = title
    resource.content = content
    resource.due = due
    resource.contact = contact
    resource.save()
    res = HttpResponse()
    res.status_code = 200
    return res
