interface TodoTaskProps {
  taskName: string;
}

const TodoTask = ({
  taskName
} : TodoTaskProps) => {
  return (
    <div className="w-full flex flex-row items-center border-b-2 px-5 py-4">
      <input type="checkbox" className="ml-2 mr-4 w-[16px] h-[16px] text-[#aeaeae]" />
      <span> {taskName} </span>
    </div>
  )
}

export default TodoTask