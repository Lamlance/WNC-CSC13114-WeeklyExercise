import { Trash } from "lucide-react";
import { useAppDispatch } from "../../hooks/Redux/ReduxHook";
import { todoRemove, todoToggle } from "../../hooks/Redux/ToDoSlice";

interface TodoTaskProps {
  id: string;
  taskName: string;
  completed: boolean;
}

const TodoTask = ({ id, taskName, completed }: TodoTaskProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className="w-full flex flex-row items-center border-b-2 px-5 py-4">
      <input
        type="checkbox"
        className="ml-2 mr-4 w-[16px] h-[16px] text-[#aeaeae]"
        checked={completed}
        onChange={() => dispatch(todoToggle(id))}
      />
      <span className="flex-1"> {taskName} </span>
      <Trash
        className="hover:border-2"
        color="#aeaeae"
        size={18}
        onClick={() => dispatch(todoRemove(id))}
      />
    </div>
  );
};

export default TodoTask;
