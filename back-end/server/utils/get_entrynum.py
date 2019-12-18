from UserSystem.models import User


def get_entrynum(openid):
    try:
        user = User.objects.get(openid=openid)
        userinfo = user.info
    except:
        return ''
    return userinfo.number_of_entry
