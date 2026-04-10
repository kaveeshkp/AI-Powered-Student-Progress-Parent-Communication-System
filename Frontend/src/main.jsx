import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./styles.css";

// Global error handler for uncaught errors
window.onerror = (message, source, lineno, colno, error) => {
  console.error("Global error:", {
    message,
    source,
    lineno,
    colno,
    error,
  });
  // Prevent default error handling
  return true;
};

// Global handler for unhandled promise rejections
window.onunhandledrejection = (event) => {
  console.error("Unhandled promise rejection:", event.reason);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
