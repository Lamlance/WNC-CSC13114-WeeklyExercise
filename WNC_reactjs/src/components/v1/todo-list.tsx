import { useEffect, useState } from "react";

import AddTask from "./add-task";
import TodoFilter from "./todo-filter";
import TodoTask from "./todo-task";

const TodoList = () => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const addTask = (taskName: string) => {
    const updatedTasks = [...tasks, taskName];
    setTasks(updatedTasks);
  };

  useEffect(() => {
    let savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    console.log("Done");
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="w-1/3">
      <TodoFilter callback={(searchText) => setSearchText(searchText)} />
      <AddTask callback={(taskName) => addTask(taskName)} />
      <div className="todoList">
        {tasks
          .filter((task) =>
            searchText === ""
              ? true
              : task.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((task) => (
            <TodoTask taskName={task} />
          ))}
      </div>
    </div>
  );
};

export default TodoList;
