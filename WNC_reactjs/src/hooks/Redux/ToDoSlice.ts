import {
  AnyAction,
  Dispatch,
  MiddlewareAPI,
  PayloadAction,
  createSlice,
} from "@reduxjs/toolkit";
import { Todo } from "../../model/todo";
import { v4 as uuidv4 } from "uuid";

const initialState: {
  todos: Todo[];
  searchText: string;
} = { todos: [], searchText: "" };

const TodosSlice = createSlice({
  name: "ToDo",
  initialState: initialState,
  reducers: {
    todoAdded: function (state, action: PayloadAction<Todo>) {
      state.todos.push({ ...action.payload });
    },
    todoRemove: function (state, action: PayloadAction<Todo["id"]>) {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
    },
    todoToggle: function (state, action: PayloadAction<Todo["id"]>) {
      const todo = state.todos.findIndex((t) => t.id === action.payload);
      if (todo < 0) return { ...state };
      state.todos[todo].completed = !state.todos[todo].completed;
    },
    todoSetSearch: function (state, action: PayloadAction<Todo["taskName"]>) {
      state.searchText = action.payload;
    },
    todoSetList: function (state, action: PayloadAction<Todo[]>) {
      state.todos = action.payload;
    },
  },
});

type ToDoActions =
  | {
      type: "ToDo/todoAdded";
      payload: Todo;
    }
  | {
      type: "ToDo/todoRemove";
      payload: Todo["id"];
    }
  | {
      type: "ToDo/todoSetSearch";
      payload: Todo["taskName"];
    }
  | {
      type: "ToDo/todoToggle";
      payload: Todo["id"];
    };

const SERVER_URL = "http://localhost:3030";
const updateToDoMiddleware =
  (store: MiddlewareAPI<Dispatch<AnyAction>, any>) =>
  (next: Dispatch<AnyAction>) =>
  (action: any) => {
    const state = store.getState();
    const { token, todos } = state;
    if (typeof action.type !== "string" || typeof token !== "string")
      return next(action);
    if (!(action.type as string).includes(TodosSlice.name) || token === "")
      return next(action);

    const todoAction = action as ToDoActions;
    switch (todoAction.type) {
      case "ToDo/todoAdded":
        fetch(`${SERVER_URL}/task`, {
          method: "POST",
          body: JSON.stringify({
            ...todoAction.payload,
            task_id: todoAction.payload.id,
          }),
          mode: "cors",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).then(async (d) => console.log(await d.text()));
        break;
      case "ToDo/todoRemove":
        fetch(`${SERVER_URL}/task/${todoAction.payload}`, {
          method: "DELETE",
          mode: "cors",
          headers: { authorization: `Bearer ${token}` },
        }).then(async (d) => console.log(await d.text()));
        break;
      case "ToDo/todoToggle":
        console.log(todos);
        const todo = todos.todos.findIndex(
          (t: Todo) => t.id === action.payload
        );
        if (todo < 0) return next(action);

        fetch(`${SERVER_URL}/task/${todoAction.payload}`, {
          method: "PATCH",
          body: JSON.stringify({ completed: !todos.todos[todo].completed }),
          mode: "cors",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).then(async (d) => console.log(await d.text()));
        break;
    }
    return next(action);
  };

export const { todoAdded, todoRemove, todoSetSearch, todoToggle, todoSetList } =
  TodosSlice.actions;
export { updateToDoMiddleware };
export default TodosSlice;
export type { ToDoActions };
