import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import type { Todo } from './types';
import TodoFilters from './components/TodoFilters';
import TodoForm from './components/TodoForm';
import TodoSearch from './components/TodoSearch';
import TodoItem from './components/TodoItem';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [searchParam, setSearchParam] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/todos')
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let url = 'http://127.0.0.1:5000/todos';
      if (searchParam) url += `?search=${encodeURIComponent(searchParam)}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => setTodos(data));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchParam]);

  const addTodo = async () => {
    // if (!newTask.trim()) return;
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

  const filterTodos = (status: 'all' | 'completed' | 'incomplete') => {
    let url = 'http://127.0.0.1:5000/todos';
    if (status === 'completed') url += '?completed=true';
    if (status === 'incomplete') url += '?completed=false';

    fetch(url)
      .then((res) => res.json())
      .then((data) => setTodos(data));
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
      <TodoForm newTask={newTask} setNewTask={setNewTask} addTodo={addTodo} />
      <TodoFilters filterTodos={filterTodos} />
      <TodoSearch searchParam={searchParam} setSearchParam={setSearchParam} />
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
                    <TodoItem
                      todo={todo}
                      provided={provided}
                      toggleTodo={toggleTodo}
                      deleteTodo={deleteTodo}
                    />
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
