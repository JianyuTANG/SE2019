from UserSystem.models import User


def get_username(openid):
    try:
        user = User.objects.get(openid=openid)
    except:
        return None
    return user.real_name
