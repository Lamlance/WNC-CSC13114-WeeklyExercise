import { Plus } from "lucide-react";
import { useState } from "react";
import { useTodosStore } from "../../hooks/use-todo-store";

const AddTask = () => {
  const [taskName, setTaskName] = useState<string>("");
  const { addTodo } = useTodosStore();

  return (
    <div className="w-full flex flex-row items-center border-2 rounded-md p-4">
      <Plus className="ml-2 mr-4" color="#aeaeae" size={18} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (taskName !== "") {
            addTodo(taskName)
          }
          setTaskName("");
        }}
      >
        <input
          type="text"
          className="focus:outline-none focus:text-zinc-900 text-[#aeaeae]"
          placeholder="Add a new task"
          onChange={(e) => setTaskName(e.target.value)}
          value={taskName}
        />
      </form>
    </div>
  );
};

export default AddTask;
