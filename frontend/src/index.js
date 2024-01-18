import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./sass/style.css";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      // transition: Bounce
    />
    <App />
  </>
);
