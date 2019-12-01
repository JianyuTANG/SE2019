from django.shortcuts import render
from django.http import HttpResponse
import os
import json
from django.views.decorators.csrf import csrf_exempt
# 使用装饰器即可避免csrf限制
import hashlib

# Create your views here.
def home(request):
    return render(request, 'index.htm', {'what':'Django File Upload'})
@csrf_exempt
def upload(request):
    print(request)
    if request.method == 'POST':
        response = []
        files = request.FILES  # 获取返回来的图片 注意小程序里面
        for key, value in files.items():
            content = value.read()
            md5 = hashlib.md5(content).hexdigest()
            path = os.path.join(md5 + '.jpg')
            with open(path, 'wb') as f:
                f.write(content)
        #     response.append({'name': key, 'md5': md5})  # 返回前台
        # handle_uploaded_file(request.FILES['file'], str(request.FILES['file']))
        data = {
            'code': 1000
        }
        data = json.dumps(data, ensure_ascii=False)

        return HttpResponse(data, content_type="application/json")

    return HttpResponse("Failed")

def handle_uploaded_file(file, filename):
    if not os.path.exists('upload/'):
        os.mkdir('upload/')

    with open('upload/' + filename, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)
