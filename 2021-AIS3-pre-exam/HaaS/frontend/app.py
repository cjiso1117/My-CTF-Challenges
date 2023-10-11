from flask import Flask, render_template, jsonify
from flask import request
import requests
import os
app = Flask(__name__)
backend = os.environ['BACKEND']
black_list = ['127.0.0.1',
    'localhost',
    '0.0.0.0',
    '::1',
    'xip.io',
]

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/haas", methods=['POST'])
def haas():
    url = request.form.get('url','')
    status = request.form.get('status', '')
    for bl in black_list:
        if bl in url:
            return "Don't Attack Server!"
    
    res = requests.post(f'http://{backend}/haas', params={'url':url,'status':status})
    # return f'Ok, you will recieve email once server status code doesn\'t respond with {status}.'
    response = app.response_class(
        response=res.text,
        status=200,
        mimetype='application/json'
    )
    return response