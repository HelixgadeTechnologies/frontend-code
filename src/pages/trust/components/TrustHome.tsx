import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation, Route, Routes, } from "react-router-dom";

import TrustBoardLayout from "../../../layouts/TrustBoardLayout";

import EconomicImpact from "../../EconomicImpact/components/EconomicImpact";
import HCDTProjects from "../../project/components/HCDTProjects";
// import ConflictResloution from "./ConflictResloution";
import TrustEstablishment from "../../trustEstablishment/component/TrustEstablishment";

import { observer } from "mobx-react-lite";

import { trustStore as TrustStore } from "../store/trustStore";
import ConflictResloution from "../../conflict/components/ConflictResolution";
import CommunitySatisfaction from "../../communitySatisfaction/components/CommunitySatisfaction";
import { authStore as AuthStore } from "../../auth/store/authStore"

const AuthStoreCtx = createContext(AuthStore);
const TrustStoreCtx = createContext(TrustStore);
const TrustDashboard = observer(() => {
  const authStore = useContext(AuthStoreCtx);
  const trustStore = useContext(TrustStoreCtx);
  const location = useLocation();
  const [isValid] = useState(true);
  useEffect(() => {
    async function getLoginUsers() {
      // authStore.user.role == "DRA"
      let selectedTrustId = window.sessionStorage.getItem("selectedTrustId")
      trustStore.selectedTrustId = selectedTrustId as string
      // console.log("selectedTrustId", selectedTrustId)
    }
    getLoginUsers();
    return () => { };
  }, []);

  return (
    <div>
      {" "}
      {!isValid && (
        <Navigate to="/login" state={{ returnTo: location.pathname }} />
      )}
      <>
        <Routes>
          <Route element={<TrustBoardLayout />}>
            {authStore.user.role === "DRA" ? (
              <>
                <Route path="/" element={<HCDTProjects />} />
                <Route
                  path="conflict-resolution"
                  element={<ConflictResloution />}
                />
                <Route
                  path="community-satisfaction"
                  element={<CommunitySatisfaction />}
                />
                <Route path="economic-impact" element={<EconomicImpact />} />

              </>
            ) : (
              <>
                <Route path="/" element={<TrustEstablishment />} />
                <Route
                  path="conflict-resolution"
                  element={<ConflictResloution />}
                />
                <Route
                  path="community-satisfaction"
                  element={<CommunitySatisfaction />}
                />
                <Route path="economic-impact" element={<EconomicImpact />} />

                <Route path="hdct-projects" element={<HCDTProjects />} />

              </>
            )}
          </Route>
        </Routes>
      </>
    </div>
  );
});

export default TrustDashboard;
