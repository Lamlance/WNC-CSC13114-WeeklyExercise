import { Search } from "lucide-react";
import { useState } from "react";
import { useTodosStore } from "../../hooks/use-todo-store";

const TodoFilter = () => {
  const [searchText, setSearchText] = useState<string>("");
  const { setFilter } = useTodosStore();

  return (
    <div className="w-full flex flex-row items-center py-4 px-5">
      <Search color="#aeaeae" className="ml-2 mr-4" size={18} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setFilter(searchText);
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
