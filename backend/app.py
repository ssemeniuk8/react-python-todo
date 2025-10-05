from flask import Flask, jsonify, request

app = Flask(__name__)

todos = []

@app.route("/")
def home():
    return "Hello, world!"

@app.route('/todos', methods=['GET'])
def get_todos():
    return jsonify(todos)

@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    todos.append(data)
    return jsonify(data), 201

if __name__ == '__main__':
    app.run(debug=True)
