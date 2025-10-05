import { useEffect, useState } from 'react';
import { FaTrash, FaGripVertical } from 'react-icons/fa';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';

interface Todo {
  id: number;
  task: string;
  completed: boolean;
  position: number;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/todos')
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  const addTodo = async () => {
    const res = await fetch('http://127.0.0.1:5000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: newTask }),
    });
    const data = await res.json();
    setTodos([...todos, data]);
    setNewTask('');
  };

  const toggleTodo = async (id: number) => {
    console.log(`Toggling todo with id: ${id}`);
    const res = await fetch(`http://127.0.0.1:5000/todos/${id}`, {
      method: 'PATCH',
    });
    const updated = await res.json();
    setTodos(todos.map((todo) => (todo.id === id ? updated : todo)));
  };

  const deleteTodo = async (id: number) => {
    console.log(`Deleting todo with id: ${id}`);
    const res = await fetch(`http://127.0.0.1:5000/todos/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setTodos(todos.filter((todo) => todo.id !== id));
    } else {
      console.error(`Failed to delete todo with id: ${id}`);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);

    const order = items.map((todo) => todo.id);
    await fetch('http://127.0.0.1:5000/todos/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-6xl font-bold mb-8">To-Do List</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}
        className="flex gap-2 justify-center"
      >
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border border-gray-600 rounded-sm p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-950"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded-sm hover:cursor-pointer hover:bg-blue-900"
        >
          Add
        </button>
      </form>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div
              className="mt-8 flex flex-col gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {todos.map((todo, index) => (
                <Draggable
                  key={todo.id}
                  draggableId={todo.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className={`p-2 rounded-sm text-left flex gap-4 items-center justify-between ${
                        todo.completed ? 'line-through' : ''
                      } hover:bg-gray-700`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div className="flex gap-4 items-center">
                        <div
                          {...provided.dragHandleProps}
                          className="hover:cursor-grab"
                        >
                          <FaGripVertical />
                        </div>
                        <div
                          onClick={() => toggleTodo(todo.id)}
                          className="cursor-pointer flex-grow"
                        >
                          {todo.task}
                        </div>
                      </div>
                      <FaTrash
                        className="text-red-500 hover:text-red-900 cursor-pointer"
                        onClick={() => deleteTodo(todo.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
