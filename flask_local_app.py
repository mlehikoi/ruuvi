import requests
from flask import Flask, Response, redirect, request

app = Flask(__name__, template_folder='/home/mlehikoi/mysite/templates')


@app.route('/')
def hello_world():
    return redirect('/static/index.html?name=humi3')
    return 'Hello from Flask!'


    #print('main page')
    #return redirect('/static/index.html')


@app.route('/api/v1/ruuvi', methods=['GET'])
def fetch_readings2():
    url = b'http://ruuvi.pythonanywhere.com/api/v1/ruuvi?' + request.query_string
    resp = requests.get(url=url)
    return Response(resp.content, content_type=resp.headers['Content-Type'])


if __name__ == "__main__":
    pass
