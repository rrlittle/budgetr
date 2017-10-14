from flask import Flask, redirect
from flask_restful_swagger_2 import Api
from views import HelloWorld

app = Flask(__name__)
print('sfsdfasdf')
api = Api(app, api_spec_url="/swagger")

print('sfsdfasdf')
api.add_resource(HelloWorld, '/hello')

@app.route('/')
def index():
    return redirect('static/swagger/index.html')

if __name__ == '__main__':
    app.run(debug=True)
