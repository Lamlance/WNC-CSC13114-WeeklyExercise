import { Outlet, Route, Routes } from "react-router-dom";
import SecondHomePage from "./routes/v2";
import FirstHomePage from "./routes/v1";
import ThirdHomePage from "./routes/v3";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="v1" element={<FirstHomePage />} />
        <Route path="v2" element={<SecondHomePage />} />
        <Route path="v3" element={<ThirdHomePage />} />
      </Route>
    </Routes>
  );
};

const Layout = () => {
  return (
    <div>
      <header className="bg-zinc-900 p-5 text-white">Todo App</header>
      <div className="pt-4">
        <Outlet />
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="p-4 m-2 border-2 rounded-full">
        <a href="/v1"> Open TodoApp v1 </a>
      </div>
      <div className="p-4 m-2 border-2 rounded-full">
        <a href="/v2"> Open TodoApp v2 </a>
      </div>
      <div className="p-4 m-2 border-2 rounded-full">
        <a href="/v3"> Open TodoApp v3 </a>
      </div>
    </div>
  );
};

export default App;
