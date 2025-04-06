import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.serving import make_server
import MySQL

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True, allow_headers=["Content-Type", "Authorization"])

SQL = MySQL.ConnectDB('localhost', 'appnavv', 'appadmin', 'appnav')

@app.route('/GetProjectList', methods=['GET', 'OPTIONS'])
def GetProjectList():
    if request.method == 'OPTIONS':
        return jsonify(200)
    type = request.args.get('type')
    platform = request.args.get('platform')
    SQL.connect()
    data = SQL.getdata_type('projectlist','platform',platform,type)
    SQL.delSQL()
    return jsonify(data)

@app.route('/FindTheProject', methods=['GET', 'POST', 'OPTIONS'])
def FindTheProject():
    if request.method == 'OPTIONS':
        return jsonify(200)
    name = request.args.get('names')
    SQL.connect()
    data = SQL.getdata_like('projectlist','name',name)
    SQL.delSQL()
    return jsonify(data)

class WebService:
    def __init__(self, host='127.0.0.1', port=3000):
        self.host = host
        self.port = port
        self.server = None

    def start(self):
        try:
            self.server = make_server(self.host, self.port, app)
            print(f"服务已部署至 {self.port} 端口")
            self.server.serve_forever()
        except KeyboardInterrupt:
            print("服务已关闭")
            self.stop()

    def stop(self):
        if self.server:
            self.server.shutdown()

if __name__ == '__main__':
    service = WebService()
    service.start()