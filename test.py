import hashlib
import base64

status = 'openid'
x = hashlib.md5()
x.update('session_key'.encode())
hashed = x.hexdigest()
status = status + hashed
ans = base64.b64encode(status.encode()).decode()
ans = base64.b64decode(ans).decode()[-32:]
print(ans)
