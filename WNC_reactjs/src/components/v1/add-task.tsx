import { Plus } from "lucide-react";
import { useRef, useState } from "react";

interface AddTaskProps {
  callback: (taskName: string) => void;
}

const AddTask = ({ callback }: AddTaskProps) => {
  const addRef = useRef<HTMLInputElement>(null);

  function add_task_handler() {
    if (!addRef.current || addRef.current.value == "") return;
    callback(addRef.current.value);
  }

  return (
    <div className="w-full flex flex-row items-center border-2 rounded-md p-4">
      <Plus className="ml-2 mr-4" color="#aeaeae" size={18} />
      <form className="flex-1" onSubmit={add_task_handler}>
        <input
          type="text"
          className="w-full focus:outline-none focus:text-zinc-900 text-[#aeaeae]"
          placeholder="Add a new task"
          ref={addRef}
        />
      </form>
    </div>
  );
};

export default AddTask;
