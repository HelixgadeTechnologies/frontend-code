import "./App.css";

import { Route, Routes } from "react-router-dom";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

import DashboardHome from "./pages/dashboard/DashboardHome";

function App() {
  return (
    <div>
      <Routes>
        {/* <Route path="/404" element={<NotFoundPage />} /> */}
        <Route path="/dashboard/*" element={<DashboardHome />} />

        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
