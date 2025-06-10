import { createContext, useContext, useEffect, useState } from "react";

import { Navigate, useLocation, Route, Routes } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import Trusts from "../trust/components";
import ProfileSettings from "../Settings/components";
import ManageAdmin from "../Settings/components/ManageAdmin";
import ManageDRA from "../Settings/components/ManageDRA";
import ManageNUPRC from "../Settings/components/ManageNUPRC";
import ManageSettlor from "../Settings/components/ManageSettlor";
import { useCookies } from "react-cookie";
import { authStore as AuthStore } from "../auth/store/authStore";
import { IUser } from "../auth/types/interface";
import { observer } from "mobx-react-lite";
import { trustStore as TrustStore } from "../trust/store/trustStore";
import DashboardMasterPage from "./DashboardMasterPage";

const TrustStoreCTX = createContext(TrustStore);
const AuthStoreCTX = createContext(AuthStore);
const DashboardHome = observer(() => {
  const authStore = useContext(AuthStoreCTX);
  const trustStore = useContext(TrustStoreCTX);
  const location = useLocation();
  const [isValid] = useState(true);

  const [cookie] = useCookies(["hcdt_admin"]);
  const admin = cookie?.hcdt_admin;

  useEffect(() => {
    async function getLoginUsers() {
      authStore.user = admin as IUser
      let selectedTrustId = window.sessionStorage.getItem("selectedTrustId")
      trustStore.selectedTrustId = selectedTrustId as string
    }
    getLoginUsers();
    return () => { };
  }, []);
  return (
    <div>
      {!isValid && (
        <Navigate to="/login" state={{ returnTo: location.pathname }} />
      )}

      <>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardMasterPage />} />
            <Route path="/trusts" element={<Trusts />} />
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
});

export default DashboardHome;
