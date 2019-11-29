import requests
from .config import template_config
from .acess_token import token_manager
import json


def push_event(openid, title, place, start_time, contact_person, phone):
    token = token_manager.get_token()
    if token is None:
        return False

    url = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='
    url = url + token

    data = {
        'thing1': {
            'value': title
        },
        'date3': {
            'value': start_time
        },
        'thing4': {
            'value': place
        },
        'phone_number5': {
            'value': phone
        },
        'name6': {
            'value': contact_person
        },
    }
    request_body = {
        'touser': openid,
        'template_id': template_config['event_template_id'],
        'data': data,
    }
    res = requests.post(url=url, json=json.dumps(request_body))

    try:
        res = res.json()
        if 'errcode' in res.keys():
            return False
    except:
        return True

    return True
