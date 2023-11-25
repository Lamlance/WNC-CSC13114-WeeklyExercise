import { Route, Routes } from "react-router-dom";
import SecondHomePage from "./routes/v2";
import FirstHomePage from "./routes/v1";

const App = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="v1" element={<FirstHomePage />} />
        <Route path="v2" element={<SecondHomePage />} />
      </Route>
    </Routes>
  );
};

const Home = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <div>
        <a href="/v1"> Open TodoApp v1 </a>
      </div>
      <div>
        <a href="/v2"> Open TodoApp v2 </a>
      </div>
    </div>
  );
};

export default App;
