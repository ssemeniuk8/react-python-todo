import type { Dispatch, SetStateAction } from 'react';

interface TodoSearchProps {
  searchParam: string;
  setSearchParam: Dispatch<SetStateAction<string>>;
}

export default function TodoSearch({ searchParam, setSearchParam }: TodoSearchProps) {
  return (
    <div className="flex gap-2 items-center mt-4">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchParam}
        onChange={(e) => setSearchParam(e.target.value)}
        className="w-full border border-gray-600 rounded-sm p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-950"
      />
    </div>
  );
}
