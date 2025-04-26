import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation, Route, Routes, } from "react-router-dom";

import TrustBoardLayout from "../../../layouts/TrustBoardLayout";

import EconomicImpact from "../../EconomicImpact/components/EconomicImpact";
import HCDTProjects from "./HCDTProjects";
import ConflictResloution from "./ConflictResloution";
import TrustEstablishment from "./TrustEstablishment";
import CommunitySatisfaction from "./CommunitySatisfaction";
import UpdateTrustEstablishment from "./UpdateTrustEstablishment";
import { observer } from "mobx-react-lite";

import { trustStore as TrustStore } from "../store/trustStore";
const TrustStoreCtx = createContext(TrustStore);
const TrustDashboard = observer(() => {
  const trustStore = useContext(TrustStoreCtx);
  const location = useLocation();
  const [isValid] = useState(true);
  useEffect(() => {
    async function getLoginUsers() {
      let selectedTrustId = window.sessionStorage.getItem("selectedTrustId")
      trustStore.selectedTrustId = selectedTrustId as string
      console.log("selectedTrustId", selectedTrustId)
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
            <Route path="/" element={<TrustEstablishment />} />
            <Route
              path="trust-establishment/update"
              element={<UpdateTrustEstablishment />}
            />
            <Route path="hdct-projects" element={<HCDTProjects />} />
            <Route
              path="conflict-resolution"
              element={<ConflictResloution />}
            />
            <Route
              path="community-satisfaction"
              element={<CommunitySatisfaction />}
            />
            <Route path="economic-impact" element={<EconomicImpact />} />
          </Route>
        </Routes>
      </>
    </div>
  );
});

export default TrustDashboard;
