import { FaTrash, FaGripVertical } from 'react-icons/fa';
import type { DraggableProvided } from '@hello-pangea/dnd';
import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  provided: DraggableProvided;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

export default function TodoItem({ todo, provided, toggleTodo, deleteTodo }: TodoItemProps) {
  return (
    <div
      className={`p-2 rounded-sm text-left flex gap-4 items-center justify-between ${todo.completed ? 'line-through' : ''} hover:bg-gray-700`}
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div className="flex gap-4 items-center flex-grow">
        <div {...provided.dragHandleProps} className="hover:cursor-grab">
          <FaGripVertical />
        </div>
        <div onClick={() => toggleTodo(todo.id)} className="cursor-pointer flex-grow">
          {todo.task}
        </div>
      </div>
      <FaTrash
        className="text-red-500 hover:text-red-900 cursor-pointer"
        onClick={() => deleteTodo(todo.id)}
      />
    </div>
  );
}
