import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import App from "./App";
import "./index.css";

import { RequestProvider } from "./context/RequestContext";
import { NotificationProvider } from "./context/NotificationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <AuthProvider>
    <RequestProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </RequestProvider>
  </AuthProvider>
</BrowserRouter>
);