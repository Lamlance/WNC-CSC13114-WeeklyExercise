import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Todo } from "../../model/todo";
import { v4 as uuidv4 } from "uuid";

const initialState: {
  todos: Todo[];
  searchText: string;
} = { todos: [], searchText: "" };

const TodosSlice = createSlice({
  name: "To Do",
  initialState: initialState,
  reducers: {
    todoAdded: function (state, action: PayloadAction<Omit<Todo, "id">>) {
      state.todos.push({ ...action.payload, id: uuidv4() });
    },
    todoRemove: function (state, action: PayloadAction<Todo["id"]>) {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
    },
    todoToggle: function (state, action: PayloadAction<Todo["id"]>) {
      const todo = state.todos.findIndex((t) => t.id === action.payload);
      if (todo < 0) return;
      state.todos[todo].completed = !state.todos[todo].completed;
    },
    todoSetSearch: function (state, action: PayloadAction<Todo["taskName"]>) {
      state.searchText = action.payload;
    },
  },
});

export const { todoAdded, todoRemove, todoSetSearch, todoToggle } =
  TodosSlice.actions;

export default TodosSlice;
