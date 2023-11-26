import { Trash } from "lucide-react";
import { useTodosStore } from "../../hooks/use-todo-store";

interface TodoTaskProps {
  id: string;
  taskName: string;
  completed: boolean;
}

const TodoTask = ({ id, taskName, completed }: TodoTaskProps) => {
  const { removeTodo, toggleCompletedState } = useTodosStore();

  return (
    <div
      className="w-full flex flex-row items-center border-b-2 px-5 py-4"
    >
      <input
        type="checkbox"
        className="ml-2 mr-4 w-[16px] h-[16px] text-[#aeaeae]"
        checked={completed}
        onChange={() => toggleCompletedState(id)}
      />
      <span className="flex-1"> {taskName} </span>
      <Trash className="hover:border-2" color="#aeaeae" size={18} onClick={() => removeTodo(id)}/>
    </div>
  );
};

export default TodoTask;
