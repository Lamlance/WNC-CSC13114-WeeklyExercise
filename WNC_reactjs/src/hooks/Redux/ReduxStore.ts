import { configureStore } from "@reduxjs/toolkit";
import TodosSlice, { updateToDoMiddleware } from "./ToDoSlice";
import TokenSlice from "./TokenSlice";
import LoadingSlice from "./LoadingSlice";

export const ReduxStore = configureStore({
  reducer: {
    todos: TodosSlice.reducer,
    token: TokenSlice.reducer,
    loading: LoadingSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(updateToDoMiddleware),
});
export type RootState = ReturnType<typeof ReduxStore.getState>;
export type AppDispatch = typeof ReduxStore.dispatch;
