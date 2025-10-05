from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

todos = []
current_id = 1

@app.route('/todos', methods=['GET'])
def get_todos():
    return jsonify(sorted(todos, key=lambda x: x['position']))

@app.route('/todos', methods=['POST'])
def add_todo():
    global current_id
    data = request.get_json()
    todo = {
        'id': current_id,
        'task': data['task'],
        'completed': False,
        'position': len(todos)
    }
    todos.append(todo)
    current_id += 1
    return jsonify(todo), 201

@app.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    print(f"Received request to delete todo with id: {todo_id}")
    todos[:] = [todo for todo in todos if todo['id'] != todo_id]
    return '', 204

@app.route('/todos/<int:todo_id>', methods=['PATCH'])
def toggle_todo(todo_id):
    for todo in todos:
        if todo['id'] == todo_id:
            todo['completed'] = not todo['completed']  # just flip it
            return jsonify(todo), 200
    return jsonify({'error': 'Todo not found'}), 404

@app.route('/todos/reorder', methods=['PATCH'])
def reorder_todos():
    data = request.get_json()
    id_order = data.get('order', [])
    id_to_todo = {todo['id']: todo for todo in todos}
    for position, todo_id in enumerate(id_order):
        if todo_id in id_to_todo:
            id_to_todo[todo_id]['position'] = position   
    todos.sort(key=lambda x: x['position'])
    return jsonify(todos), 200

if __name__ == '__main__':
    app.run(debug=True)
