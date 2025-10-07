import json
import pytest
from app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        from app import todos
        todos[:] = []  # Clear the todos list before each test
        yield client

def test_get_todos_empty(client):
    print("Running test_get_todos_empty...")
    response = client.get('/todos')
    print("Response data:", response.get_json())
    assert response.status_code == 200
    assert response.get_json() == []

def test_add_todo(client):
    print("Running test_add_todo...")
    new_todo = {'task': 'Test task'}
    response = client.post('/todos', json=new_todo)
    print("Response data:", response.get_json())
    assert response.status_code == 201
    assert response.get_json()['task'] == 'Test task'
    assert 'id' in response.get_json()

def test_get_todos_non_empty(client):
    print("Running test_get_todos_non_empty...")
    client.post('/todos', json={'task': 'Test task 1'})
    client.post('/todos', json={'task': 'Test task 2'})
    response = client.get('/todos')
    print("Response data:", response.get_json())
    assert response.status_code == 200
    todos = response.get_json()
    assert len(todos) == 2
    assert todos[0]['task'] == 'Test task 1'
    assert todos[1]['task'] == 'Test task 2'

def test_toggle_todo(client):
    print("Running test_toggle_todo...")
    post_response = client.post('/todos', json={'task': 'Test task'})
    todo = post_response.get_json()
    todo_id = todo['id']
    assert todo['completed'] is False

    response = client.patch(f'/todos/{todo_id}')
    print("Response data:", response.get_json())
    assert response.status_code == 200
    assert response.get_json()['completed'] is True

def test_delete_todo(client):
    print("Running test_delete_todo...")
    post_response = client.post('/todos', json={'task': 'Test task'})
    todo = post_response.get_json()
    todo_id = todo['id']

    response = client.delete(f'/todos/{todo_id}')
    print("Response status code:", response.status_code)
    assert response.status_code == 204

    get_response = client.get('/todos')
    print("Todos after deletion:", get_response.get_json())
    assert get_response.get_json() == []

def test_reorder_todos(client):
    print("Running test_reorder_todos...")
    client.post('/todos', json={'task': 'Task 1'})
    client.post('/todos', json={'task': 'Task 2'})
    client.post('/todos', json={'task': 'Task 3'})

    response = client.get('/todos')
    todos = response.get_json()
    ids = [todo['id'] for todo in todos]
    print("Original order of IDs:", ids)

    new_order = [ids[2], ids[0], ids[1]]
    reorder_response = client.patch('/todos/reorder', json={'order': new_order})
    print("Reorder response data:", reorder_response.get_json())
    assert reorder_response.status_code == 200

    get_response = client.get('/todos')
    reordered_todos = get_response.get_json()
    reordered_ids = [todo['id'] for todo in reordered_todos]
    print("New order of IDs after reordering:", reordered_ids)
    assert reordered_ids == new_order