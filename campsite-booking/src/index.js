import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import AuthProvider from "./context/AuthProvider.js";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <AuthProvider>
        <App />
    </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found!");
}