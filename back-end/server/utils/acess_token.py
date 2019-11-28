import requests
import time
from .config import app_config


class TokenManager:
    token = ''
    expire = 0

    def __init__(self):
        TokenManager.token = ''
        TokenManager.expire = 0

    def get_token(self):
        current_time = time.time()
        if current_time < TokenManager.expire - 120:
            return TokenManager.token
        if self.request_token():
            return TokenManager.token
        else:
            return None

    def request_token(self):
        url = 'https://api.weixin.qq.com/cgi-bin/token'
        header = {
            'grant_type': 'client_credential',
            'appid': app_config['appid'],
            'secret': app_config['secret'],
        }
        current_time = time.time()
        try:
            r = requests.get(url, params=header)
            res = r.json()
        except:
            return False

        if 'errcode' in res.keys():
            return False

        TokenManager.token = res['access_token']
        TokenManager.expire = current_time + res['expires_in']
        return True


token_manager = TokenManager()
