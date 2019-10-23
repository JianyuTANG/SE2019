from django.shortcuts import render
from django.http import HttpResponse
from .models import User
from .utils import *
import json


def login(request):
    post_body = request.body
    json_request = json.loads(post_body)
    code = json_request['code']
    login_status = authenticator(code)
    openid = login_status['openid']
    session_key = login_status['session_key']
    connection_status = 'rejected'
    if login_status['errcode'] == 0:
        connection_status = 'acknowledged'
    else:
        res = {'session_code': '0',
               'connection_status': connection_status,
               'identity': 'guest'}
        return HttpResponse(json.dumps(res), content_type="application/json")
    user = User.objects.get(openid=openid)
    if user is None:
        user = User.objects.create()
        user.openid = openid
        user.logon_status = 'guest'
        user.save()
    logon_status = user.logon_status
    hashed = status_hash(openid, session_key)
    res = {'session_code': hashed,
           'connection_status': connection_status,
           'identity': logon_status}
    return HttpResponse(json.dumps(res), content_type="application/json")

def register(request):
    post_body = request.body
    json_request = json.loads(post_body)
    openid, hashed_session = status_dehash(json_request.session_code)
    user = User.objects.get(openid=openid)
    if user is None:
        res = {'connection_status': 'rejected',
               'result': 'fail'}
        return HttpResponse(json.dumps(res), content_type="application/json")
    name = json_request.name
    num = json_request.num
    classmate = json_request.classmate
    advisor = json_request.advisor
    res = {'connection_status': 'acknowledged',
           'result': 'fail'}
    if verify_identity(name, num, classmate, advisor) != 0:
        res.result = 'success'
        user.real_name = name
        user.number_of_entry = num
        user.save()
    return HttpResponse(json.dumps(res), content_type="application/json")


def invite(request):
    post_body = request.body
    json_request = json.loads(post_body)
    openid, hashed_session = status_dehash(json_request.session_code)
    user = User.objects.get(openid=openid)
    if user is None:
        res = {'connection_status': 'rejected',
               'result': 'fail'}
        return HttpResponse(json.dumps(res), content_type="application/json")
    res = {'connection_status': 'acknowledged',
           'result': 'fail'}
    invitation_code = json_request.invitation_code
    if verify_invitation(invitation_code) != 0:
        res.result = 'success'
    return HttpResponse(json.dumps(res), content_type="application/json")
