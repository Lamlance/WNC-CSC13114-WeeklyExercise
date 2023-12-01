import { create } from "zustand";
import { Todo } from "../model/todo";
import { v4 as uuidv4 } from "uuid";

interface TodoState {
  todos: Todo[];
  searchText: string;
  addTodo: (taskName: string) => void;
  removeTodo: (id: string) => void;
  toggleCompletedState: (id: string) => void;
  setFilter: (searchText: string) => void;
}

export const useTodosStore = create<TodoState>((set) => ({
  todos: [],
  searchText: "",
  addTodo: (taskName: string) => {
    set((state) => ({
      ...state,
      todos: [
        ...state.todos,
        {
          id: uuidv4(),
          taskName,
          completed: false,
        },
      ],
    }));
  },
  removeTodo: (id: string) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
  },
  toggleCompletedState: (id: string) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }));
  },
  setFilter: (searchText: string) => {
    set(() => ({
      searchText: searchText,
    }));
  },
}));
