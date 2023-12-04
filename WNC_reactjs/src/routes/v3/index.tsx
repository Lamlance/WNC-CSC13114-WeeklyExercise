import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/Redux/ReduxHook";
import V3_TaskItem from "../../components/v3/ToDoItem";
import { Provider } from "react-redux";
import { ReduxStore } from "../../hooks/Redux/ReduxStore";
import V3_AddTask from "../../components/v3/AddTask";
import V3_TodoFilter from "../../components/v3/ToDoFilter";
import { todoAdded, todoSetList } from "../../hooks/Redux/ToDoSlice";
import { setToken } from "../../hooks/Redux/TokenSlice";
const SERVER_URL = "http://localhost:3030";

function ThirdHomePage() {
  const navigate = useNavigate();
  const { todos, searchText } = useAppSelector((state) => state.todos);
  const access_token = useAppSelector((state) => state.token);
  const dispath = useAppDispatch();

  useEffect(() => {
    fetch(`${SERVER_URL}/task/`, {
      headers: { authorization: `Bearer ${access_token}` },
      mode: "cors",
    }).then(async (data) => {
      try {
        const json = await data.json();
        console.log("Current data: ", json);
        dispath(todoSetList(json.data));
      } catch (e) {}
    });
  }, []);

  function log_out_handler() {
    localStorage.removeItem("accessToken");
    setTimeout(() => navigate("/v3/login"), 2000);
  }

  const filteredList = todos.filter((t) => t.taskName.includes(searchText));
  return (
    <div className=" relative flex justify-center items-center">
      <button
        onClick={log_out_handler}
        className="absolute right-4 top-4 px-4 py-2 border border-zinc-500 rounded-xl"
      >
        Logout
      </button>
      <div className=" w-1/3">
        <V3_AddTask />
        <V3_TodoFilter />
        {filteredList.map((t) => (
          <V3_TaskItem key={t.id} {...t} />
        ))}
      </div>
    </div>
  );
}

function LoadingCircle() {
  return (
    <div className=" bg-slate-500 flex flex-row px-4 w-full h-full">
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p>Loading</p>
    </div>
  );
}

function HomePageWrapper() {
  const accessToken = useAppSelector((state) => state.token);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(function () {
    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken) setTimeout(() => navigate("/v3/login"), 5000);
    else {
      fetch(`${SERVER_URL}/auth`, {
        method: "GET",
        headers: {
          authorization: `Brearer ${storedToken}`,
        },
      }).then(async (data) => {
        console.log(await data.text());
        if (data.status != 200) setTimeout(() => navigate("/v3/login"), 5000);
        else setTimeout(() => dispatch(setToken(storedToken)), 5000);
      });
    }
  });

  return (
    <div>
      {!accessToken ? (
        <div>
          <LoadingCircle />
        </div>
      ) : (
        <div>
          <ThirdHomePage />
        </div>
      )}
    </div>
  );
}

export default function () {
  return (
    <Provider store={ReduxStore}>
      <HomePageWrapper />
    </Provider>
  );
}
