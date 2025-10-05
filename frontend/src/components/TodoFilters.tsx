interface TodoFiltersProps {
  filterTodos: (status: 'all' | 'completed' | 'incomplete') => void;
}

export default function TodoFilters({ filterTodos }: TodoFiltersProps) {
  return (
    <div className="flex gap-2 items-center justify-between p-4 mt-4">
      <button
        onClick={() => filterTodos('completed')}
        className="bg-purple-500 text-white px-4 py-2 rounded-sm hover:bg-purple-700 w-1/3 cursor-pointer"
      >
        Complete
      </button>
      <button
        onClick={() => filterTodos('incomplete')}
        className="bg-yellow-500 text-white px-4 py-2 rounded-sm hover:bg-yellow-700 w-1/3 cursor-pointer"
      >
        Incomplete
      </button>
      <button
        onClick={() => filterTodos('all')}
        className="bg-green-500 text-white px-4 py-2 rounded-sm hover:bg-green-700 w-1/3 cursor-pointer"
      >
        All
      </button>
    </div>
  );
}
