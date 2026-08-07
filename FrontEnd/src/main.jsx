import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { RequestProvider } from "./context/RequestContext";
import { NotificationProvider } from "./context/NotificationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <RequestProvider>
          <App />
        </RequestProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
);