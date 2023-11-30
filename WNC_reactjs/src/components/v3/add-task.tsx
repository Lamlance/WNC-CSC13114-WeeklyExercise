import { Plus } from "lucide-react";
import { useState } from "react";
import { useAppDispatch } from "../../hooks/Redux/ReduxHook";
import { todoAdded } from "../../hooks/Redux/ToDoSlice";

const AddTask = () => {
  const [taskName, setTaskName] = useState<string>("");
  const dispatch = useAppDispatch();

  return (
    <div className="w-full flex flex-row items-center border-2 rounded-md p-4">
      <Plus className="ml-2 mr-4" color="#aeaeae" size={18} />
      <form
        className="flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          if (taskName !== "") {
            dispatch(todoAdded({ taskName: taskName, completed: false }));
          }
          setTaskName("");
        }}
      >
        <input
          type="text"
          className="w-full focus:outline-none focus:text-zinc-900 text-[#aeaeae]"
          placeholder="Add a new task"
          onChange={(e) => setTaskName(e.target.value)}
          value={taskName}
        />
      </form>
    </div>
  );
};

export default AddTask;
