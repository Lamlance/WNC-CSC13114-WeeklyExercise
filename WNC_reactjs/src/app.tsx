import { Outlet, Route, Routes } from "react-router-dom";
import SecondHomePage from "./routes/v2";
import FirstHomePage from "./routes/v1";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="v1" element={<FirstHomePage />} />
        <Route path="v2" element={<SecondHomePage />} />
      </Route>
    </Routes>
  );
};

const Layout = () => {
  return (
    <div>
      <header className="bg-zinc-900 p-5 text-white">
        Todo App
      </header>
      <div className="pt-4">
        <Outlet />
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div>
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
