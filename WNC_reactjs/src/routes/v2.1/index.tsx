import { Provider } from "react-redux";
import TodoList from "../../components/v2.1/todo-list";
import { ReduxStore } from "../../hooks/Redux/ReduxStore";

const AnotherSecondHomePage = () => {
  return (
    <Provider store={ReduxStore}>
      <div className="flex justify-center items-center">
        <TodoList />
      </div>
    </Provider>
  );
};

export default AnotherSecondHomePage;
