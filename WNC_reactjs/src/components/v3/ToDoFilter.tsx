import { RefreshCw, Search } from "lucide-react";
import { useState, useRef } from "react";
import { useAppDispatch } from "../../hooks/Redux/ReduxHook";
import { todoSetSearch } from "../../hooks/Redux/ToDoSlice";

const V3_TodoFilter = () => {
  const srchRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  return (
    <div className="w-full flex flex-row items-center py-4 px-5">
      <Search color="#aeaeae" className="ml-2 mr-4" size={18} />
      <form
        className="flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          if (typeof srchRef.current?.value === "string") {
            dispatch(todoSetSearch(srchRef.current.value));
          }
        }}
      >
        <input
          ref={srchRef}
          type="text"
          className="focus:outline-none w-full"
          placeholder="Find task by name"
        />
      </form>
    </div>
  );
};

export default V3_TodoFilter;
