import { Provider } from "react-redux";
import TodoList from "../../components/v3/todo-list";
import { ReduxStore } from "../../hooks/Redux/ReduxStore";

const ThirdHomePage = () => {
  return (
    <Provider store={ReduxStore}>
      <div className="flex justify-center items-center">
        <TodoList />
      </div>
    </Provider>
  );
};

export default ThirdHomePage;
