import hashlib


def session_check(session_key, request_code):
    '''

    :param session_key: 数据库中的session_key字段
    :param request_code: 客户端传来的session_code，用于校验客户端身份
    :return: True / False
    '''
    standard = hashlib.md5()
    standard.update(session_key.encode())
    standard = standard.hexdigest()
    if standard == request_code[-32:]:
        return True
    else:
        return False