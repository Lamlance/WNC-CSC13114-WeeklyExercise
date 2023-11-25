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
      id={id}
    >
      <input
        type="checkbox"
        className="ml-2 mr-4 w-[16px] h-[16px] text-[#aeaeae]"
        checked={completed}
        onChange={() => toggleCompletedState(id)}
      />
      <span> {taskName} </span>
    </div>
  );
};

export default TodoTask;
