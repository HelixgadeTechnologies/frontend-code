import "./App.css";

import { Navigate, Outlet, Route, Routes } from "react-router-dom";


import DashboardHome from "./pages/dashboard/DashboardHome";
import TrustDashboard from "./pages/trust/components/TrustHome";
import { configure } from "mobx";
// import Login from "./pages/auth/component/Login";
import AuthMasterPage from "./pages/auth/component/AuthMasterPage";
import ConflictDataForm from "./pages/form/ConflictDataForm";
import SatisfactionDataForm from "./pages/form/SatisfactionDataForm";
import EconomicImpactDataForm from "./pages/form/EconomicImpactDataForm";
import EntryDashboard from "./pages/dashboard/component/EntryDashboard";
import GeneralDashboard from "./pages/dashboard/component/GeneralDashboard";
import AdminAuthPage from "./pages/auth/component/AdminAuthPage";

// Disable strict mode globally
configure({
  enforceActions: "never", // or "observed", or "always"
});

function App() {
  return (
    <div>
      <Routes>
        <Route element={<ProtectedRoute />} >
          <Route path="/dashboard/*" element={<DashboardHome />} />
          <Route path="/trust/:name/:id/*" element={<TrustDashboard />} />
        </Route>
        <Route path="/" element={<EntryDashboard><GeneralDashboard /></EntryDashboard>} />
        <Route path="/auth/:option" element={<AuthMasterPage />} />
        <Route path="/auth/admin" element={<AdminAuthPage />} />
        <Route path="/conflict/:trustId" element={<ConflictDataForm />} />
        <Route path="/economic-impact/:trustId" element={<EconomicImpactDataForm />} />
        <Route path="/satisfaction/:trustId" element={<SatisfactionDataForm />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        <Route path="*" element={<AuthMasterPage />} />
      </Routes>
    </div>
  );
}

const ProtectedRoute = () => {
  const token = window.sessionStorage.getItem("qrjwt");
  return token ? <Outlet /> : <Navigate to="/auth/1" replace />;
};

export default App;
