import { RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { useAppDispatch } from "../../hooks/Redux/ReduxHook";
import { todoSetSearch } from "../../hooks/Redux/ToDoSlice";

const TodoFilter = () => {
  const [searchText, setSearchText] = useState<string>("");
  const dispatch = useAppDispatch();

  return (
    <div className="w-full flex flex-row items-center py-4 px-5">
      <Search color="#aeaeae" className="ml-2 mr-4" size={18} />
      <form
        className="flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(todoSetSearch(searchText));
        }}
      >
        <input
          type="text"
          className="focus:outline-none w-full"
          placeholder="Find task by name"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      </form>
      {searchText !== "" && (
        <RefreshCw
          color="#aeaeae"
          size={18}
          onClick={() => {
            dispatch(todoSetSearch(searchText));
            setSearchText("");
          }}
        />
      )}
    </div>
  );
};

export default TodoFilter;
