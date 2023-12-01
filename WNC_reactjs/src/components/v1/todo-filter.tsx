import { RefreshCw, Search } from "lucide-react";
import { useRef, useState } from "react";

interface TodoFilterProps {
  callback: (searchText: string) => void;
}

const TodoFilter = ({ callback }: TodoFilterProps) => {
  const [searchText, setSearchText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  function filter_handler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!inputRef.current) return;

    callback(inputRef.current.value);
  }

  return (
    <div className="w-full flex flex-row items-center py-4 px-5">
      <Search color="#aeaeae" className="ml-2 mr-4" size={18} />
      <form className="flex flex-row flex-1 gap-x-2" onSubmit={filter_handler}>
        <input
          type="text"
          className="focus:outline-none border-b-2 border-gray-500 flex-1"
          placeholder="Find task by name"
          ref={inputRef}
        />
        <input
          type="submit"
          value={"Search"}
          className=" border-gray-500 border p-2"
        />
      </form>
    </div>
  );
};

export default TodoFilter;
