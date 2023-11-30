import AddTask from "./add-task";
import TodoFilter from "./todo-filter";
import TodoTask from "./todo-task";
import { useAppSelector } from "../../hooks/Redux/ReduxHook";

const TodoList = () => {
  const { todos, searchText } = useAppSelector((state) => state.todos);
  return (
    <div className="w-1/3">
      <TodoFilter />
      <AddTask />
      <div className="todoList">
        {todos
          .filter((task) =>
            searchText === ""
              ? true
              : task.taskName.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((task) => (
            <TodoTask
              id={task.id}
              taskName={task.taskName}
              completed={task.completed}
            />
          ))}
      </div>
    </div>
  );
};

export default TodoList;
