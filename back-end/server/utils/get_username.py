from UserSystem.models import User


def get_username(openid):
    try:
        user = User.objects.get(openid=openid)
        userinfo = user.info
    except:
        return ''
    return userinfo.real_name
