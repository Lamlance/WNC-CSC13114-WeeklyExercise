import { Trash } from "lucide-react";
interface TodoTaskProps {
  id: string;
  taskName: string;
  completed: boolean;
  callbackCompleted: (id: string) => void;
  callbackRemoved: (id: string) => void;
}

const TodoTask = ({
  id,
  taskName,
  completed,
  callbackCompleted,
  callbackRemoved,
}: TodoTaskProps) => {
  return (
    <div className="w-full flex flex-row items-center border-b-2 px-5 py-4">
      <input
        type="checkbox"
        className="ml-2 mr-4 w-[16px] h-[16px] text-[#aeaeae]"
        checked={completed}
        onChange={() => callbackCompleted(id)}
      />
      <span className="flex-1"> {taskName} </span>
      <Trash
        className="hover:border-2"
        color="#aeaeae"
        size={18}
        onClick={() => callbackRemoved(id)}
      />
    </div>
  );
};

export default TodoTask;
