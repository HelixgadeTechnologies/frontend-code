import { useState } from "react";
import { Navigate, useLocation, Route, Routes } from "react-router-dom";

import TrustBoardLayout from "../../layouts/TrustBoardLayout";

import EconomicImpact from "./EconomicImpact";
import HCDTProjects from "./HCDTProjects";
import ConflictResloution from "./ConflictResloution";
import TrustEstablishment from "./TrustEstablishment";
import CommunitySatisfaction from "./CommunitySatisfaction";

import UpdateTrustEstablishment from "./UpdateTrustEstablishment";

const TrustDashboard = () => {
  const location = useLocation();
  const [isValid] = useState(true);

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
};

export default TrustDashboard;
