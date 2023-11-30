import { configureStore } from "@reduxjs/toolkit";
import TodosSlice from "./ToDoSlice";

export const ReduxStore = configureStore({
  reducer: {
    todos: TodosSlice.reducer,
  },
});
export type RootState = ReturnType<typeof ReduxStore.getState>;
export type AppDispatch = typeof ReduxStore.dispatch;
