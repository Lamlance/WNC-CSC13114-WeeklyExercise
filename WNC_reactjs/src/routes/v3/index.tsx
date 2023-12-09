import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/Redux/ReduxHook";
import V3_TaskItem from "../../components/v3/ToDoItem";
import V3_AddTask from "../../components/v3/AddTask";
import V3_TodoFilter from "../../components/v3/ToDoFilter";
import { todoSetList } from "../../hooks/Redux/ToDoSlice";
import { setToken } from "../../hooks/Redux/TokenSlice";
import { setLoading } from "../../hooks/Redux/LoadingSlice";
const SERVER_URL = "http://localhost:3030";

function ThirdHomePage() {
  const navigate = useNavigate();
  const { todos, searchText } = useAppSelector((state) => state.todos);
  const access_token = useAppSelector((state) => state.token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(""));
    fetch(`${SERVER_URL}/task/`, {
      headers: { authorization: `Bearer ${access_token}` },
      mode: "cors",
    }).then(async (data) => {
      try {
        const json = await data.json();
        console.log("Current data: ", json);
        dispatch(todoSetList(json.data));
      } catch (e) {}
    });
  }, []);

  function log_out_handler() {
    localStorage.removeItem("accessToken");
    dispatch(setLoading("Logging out"));
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
export { ThirdHomePage };
export default function AuthWrapper({
  ProtectedPage,
}: {
  ProtectedPage: () => JSX.Element;
}) {
  const accessToken = useAppSelector((state) => state.token);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(function () {
    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken) {
      dispatch(setLoading("Not found previous login"));
      setTimeout(() => navigate("/v3/login"), 5000);
    } else {
      dispatch(setLoading("Authorizing"));
      fetch(`${SERVER_URL}/auth`, {
        method: "GET",
        headers: {
          authorization: `Brearer ${storedToken}`,
        },
      })
        .then(async (data) => {
          console.log(await data.text());
          if (data.status != 200) {
            dispatch(setLoading("Login failed"));
            setTimeout(() => navigate("/v3/login"), 3000);
          } else {
            dispatch(setLoading("Login successful"));
            setTimeout(() => dispatch(setToken(storedToken)), 3000);
          }
        })
        .catch(() => dispatch(setLoading("Login error")));
    }
  }, []);

  return (
    <div className=" relative w-screen min-h-screen">
      {!accessToken ? null : <div>{<ProtectedPage />}</div>}
    </div>
  );
}
