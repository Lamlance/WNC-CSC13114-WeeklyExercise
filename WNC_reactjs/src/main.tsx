import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Index_v1 from "./v1";
import Index_v2 from "./v2";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <>
      <Index_v1 />
      <Index_v2 />
    </>
  </React.StrictMode>
);
