import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { QueryProvider } from "./utils/QueryProvider.tsx";
import { CookiesProvider } from "react-cookie";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <QueryProvider>
          <App />
        </QueryProvider>
      </CookiesProvider>
    </Router>
  </StrictMode>,
);
