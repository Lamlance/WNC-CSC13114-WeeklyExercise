import { Plus } from "lucide-react";
import { useRef } from "react";
import { useAppDispatch } from "../../hooks/Redux/ReduxHook";
import { todoAdded } from "../../hooks/Redux/ToDoSlice";
import { v4 } from "uuid";

const V3_AddTask = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  return (
    <div className="w-full flex flex-row items-center border-2 rounded-md p-4">
      <Plus className="ml-2 mr-4" color="#aeaeae" size={18} />
      <form
        className="flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          if (nameRef.current?.value) {
            dispatch(
              todoAdded({
                taskName: nameRef.current.value,
                completed: false,
                id: v4(),
              })
            );
            nameRef.current.value = "";
          }
        }}
      >
        <input
          type="text"
          className="w-full focus:outline-none focus:text-zinc-900 text-[#aeaeae]"
          placeholder="Add a new task"
          ref={nameRef}
        />
      </form>
    </div>
  );
};

export default V3_AddTask;
