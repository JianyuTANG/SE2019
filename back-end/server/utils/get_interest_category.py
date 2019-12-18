from UserSystem.models import User


def get_interest_category(openid):
    try:
        user = User.objects.get(openid=openid)
        userinfo = user.info
    except:
        return ''
    return userinfo.interest_category
