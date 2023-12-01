import { useEffect, useState } from "react";

import AddTask from "./add-task";
import TodoFilter from "./todo-filter";
import TodoTask from "./todo-task";
import { Todo } from "../../model/todo";
import { v4 as uuidv4 } from "uuid";

const TodoList = () => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const addTask = (task: Todo) => {
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
  };

  const handleCallbackCompleted = (id: string) => {
    const taskId = tasks.findIndex((t) => t.id === id);
    if (taskId < 0) return;

    tasks[taskId].completed = !tasks[taskId].completed;
    setTasks([...tasks]);
  };

  const handleCallbackRemoved = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    console.log("saved tasks", savedTasks);
    if (savedTasks && savedTasks != "[]") {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);
  useEffect(
    function () {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    },
    [tasks]
  );
  return (
    <div className="w-1/3">
      <TodoFilter callback={(searchText) => setSearchText(searchText)} />
      <AddTask
        callback={(taskName) =>
          addTask({ id: uuidv4(), taskName, completed: false })
        }
      />
      <div className="todoList">
        {tasks
          .filter((task) =>
            searchText === ""
              ? true
              : task.taskName.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((task) => (
            <TodoTask
              key={task.id}
              id={task.id}
              taskName={task.taskName}
              completed={task.completed}
              callbackCompleted={(id) => handleCallbackCompleted(id)}
              callbackRemoved={(id) => handleCallbackRemoved(id)}
            />
          ))}
      </div>
    </div>
  );
};

export default TodoList;
