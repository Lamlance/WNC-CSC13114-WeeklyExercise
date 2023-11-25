import { Search } from "lucide-react";
import { useState } from "react";

interface TodoFilterProps {
  callback: (searchText: string) => void;
}

const TodoFilter = ({ callback }: TodoFilterProps) => {
  const [searchText, setSearchText] = useState<string>("");

  return (
    <div className="w-full flex flex-row items-center py-4 px-5">
      <Search color="#aeaeae" className="ml-2 mr-4" size={18} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          callback(searchText);
        }}
      >
        <input
          type="text"
          className="focus:outline-none"
          placeholder="Find task by name"
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          value={searchText}
        />
      </form>
    </div>
  );
};

export default TodoFilter;
