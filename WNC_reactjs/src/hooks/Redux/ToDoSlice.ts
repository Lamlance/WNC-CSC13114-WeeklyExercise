import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Todo } from "../../model/todo";
import { randomUUID } from "crypto";

const initialState: {
  todos: Todo[];
  searchText: string;
} = { todos: [], searchText: "" };

const TodosSlice = createSlice({
  name: "To Do",
  initialState: initialState,
  reducers: {
    todoAdded: function (state, action: PayloadAction<Omit<Todo, "id">>) {
      state.todos.push({ ...action.payload, id: randomUUID() });
    },
    todoRemove: function (state, action: PayloadAction<Todo["id"]>) {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
    },
    todoToggle: function (state, action: PayloadAction<Todo["id"]>) {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    todoSetSearch: function (state, action: PayloadAction<Todo["taskName"]>) {
      state.searchText = action.payload;
    },
  },
});

export const { todoAdded, todoRemove, todoSetSearch, todoToggle } =
  TodosSlice.actions;

export default TodosSlice;
