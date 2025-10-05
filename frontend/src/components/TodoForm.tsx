import type { Dispatch, SetStateAction } from 'react';

interface TodoFormProps {
  newTask: string;
  setNewTask: Dispatch<SetStateAction<string>>;
  addTodo: () => void;
}

export default function TodoForm({ newTask, setNewTask, addTodo }: TodoFormProps) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); addTodo(); }}
      className="flex gap-2 justify-center"
    >
      <input
        type="text"
        value={newTask}
        placeholder="Add a new task..."
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
  );
}
