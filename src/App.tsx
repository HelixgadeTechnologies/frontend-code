import "./App.css";

import { Route, Routes } from "react-router-dom";


import DashboardHome from "./pages/dashboard/DashboardHome";
import TrustDashboard from "./pages/trust/components/TrustHome";
import { configure } from "mobx";
import Login from "./pages/auth/component/Login";
import ForgotPassword from "./pages/auth/component/ForgotPassword";

// Disable strict mode globally
configure({
  enforceActions: "never", // or "observed", or "always"
});

function App() {
  return (
    <div>
      <Routes>
        {/* <Route path="/404" element={<NotFoundPage />} /> */}
        <Route path="/dashboard/*" element={<DashboardHome />} />
        <Route path="/trust/:name/:id/*" element={<TrustDashboard />} />

        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
