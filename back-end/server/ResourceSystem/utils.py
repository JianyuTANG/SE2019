import requests
import base64
import hashlib
from .config import app_config

def status_hash(openid, session_key):
    '''

    :param openid: 微信api返回
    :param session_key: 微信api返回
    :return: 通过openid 和 sessionkey 计算得到的一个登陆状态码，需要保证一定安全性
    '''
    status = openid
    x = hashlib.md5()
    x.update(session_key.encode())
    hashed = x.hexdigest()
    status = status + hashed
    ans = base64.b64encode(status.encode()).decode()
    return ans

def status_dehash(hashcode):
    '''

    :param hashcode: 客户端发送的session_code
    :return: 解码后的 openid值 和 sessionkey的MD5值
    '''
    try:
        decoded = base64.b64decode(hashcode).decode('utf-8')
    except:
        return '0', '0'
    openid = decoded[:-32]
    hashed_session = decoded[-32:]
    return openid, hashed_session
