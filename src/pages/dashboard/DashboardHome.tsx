import { useState } from "react";

import { Navigate, useLocation, Route, Routes } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardPage from "./DashboardPage";

import ProfileSettings from "./Settings";
import ManageAdmin from "./Settings/ManageAdmin";
import ManageDRA from "./Settings/ManageDRA";
import ManageNUPRC from "./Settings/ManageNUPRC";
import ManageSettlor from "./Settings/ManageSettlor";

import Trusts from "./Trusts";
import CreateTrust from "./Trusts/CreateTrust";

const DashboardHome = () => {
  const location = useLocation();
  const [isValid] = useState(true);
  return (
    <div>
      {!isValid && (
        <Navigate to="/login" state={{ returnTo: location.pathname }} />
      )}

      <>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/trusts" element={<Trusts />} />
            <Route path="/trusts/create-trust" element={<CreateTrust />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route path="settings/manage-admin" element={<ManageAdmin />} />
            <Route path="settings/manage-dra" element={<ManageDRA />} />
            <Route path="settings/manage-nuprc" element={<ManageNUPRC />} />
            <Route
              path="settings/manage-settlors"
              element={<ManageSettlor />}
            />
          </Route>
        </Routes>
      </>
    </div>
  );
};

export default DashboardHome;
