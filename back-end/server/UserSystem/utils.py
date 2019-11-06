import requests
import base64
import hashlib
from .config import app_config
from .models import User


def get_user(session_code):
    '''

    :param session_code:
    :return: 如果session_code正确，返回数据库user对象；否则返回None
    '''

    openid, hashed_session = status_dehash(session_code)
    user = User.objects.get(openid=openid)
    return user


def authenticator(tempcode):
    '''

    :param tempcode: wx.login()得到的临时验证code，用于向微信api请求验证
    :return: 唯一的openid
    '''
    url = 'https://api.weixin.qq.com/sns/jscode2session'
    body = {'appid': app_config['appid'],
            'secret': app_config['secret'],
            'js_code': tempcode,
            'grant_type': 'authorization_code'}
    r = requests.get(url, params=body)
    res = r.json()
    return res


def status_hash(openid, session_key):
    '''

    :param openid: 微信api返回
    :param session_key: 微信api返回
    :return: 通过openid 和 sessionkey 计算得到的一个登陆状态码，需要保证一定安全性
    '''
    status = openid
    x = hashlib.md5()
    x.update(session_key)
    hashed = x.hexdigest()
    status = status + hashed
    ans = base64.b64encode(status)
    return ans


def session_check(session_key, request_code):
    '''

    :param session_key: 微信api返回
    :param request_code: 客户端传来的session_code，用于校验客户端身份
    :return: True / False
    '''
    standard = hashlib.md5().update(session_key).hexdigest()
    if standard == request_code[-32:]:
        return True
    else:
        return False


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


def verify_student_identity(name, num, classmate, advisor):
    pass


def verify_teacher_identity(name, num, classmate, advisor):
    pass


def verify_invitation(invitation_code):
    pass
