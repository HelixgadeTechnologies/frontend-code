import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Button, DashboardSkeleton, GoBack } from "../../../components/elements";
import { EconomicImpactTable } from "./table/EconomicImpactTable";
import EconomicImpactDashboard from "./chart/EconomicImpactDashboard";
import { economicImpactStore as EconomicImpactStore } from "../store/economicImpactStore";
import { authStore as AuthStore } from "../../../pages/auth/store/authStore";
import { trustStore as TrustStore } from "../../trust/store/trustStore";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import EconomicImpactForm from "./form/EconomicImpactForm";
import EconomicImpactUpload from "./upload/EconomicImpactUpload";

const EconomicImpactStoreCtx = createContext(EconomicImpactStore);
const AuthStoreCtx = createContext(AuthStore);
const TrustStoreCtx = createContext(TrustStore);

const EconomicImpact = observer(() => {
  const economicImpactStore = useContext(EconomicImpactStoreCtx);
  const authStore = useContext(AuthStoreCtx);
  const trustStore = useContext(TrustStoreCtx);
  
  const [isTableView, setIsTableView] = useState(true);
  const { name } = useParams();
  const navigate = useNavigate();

  const openAddForm = useCallback(() => {
    economicImpactStore.isBulkUploadMode = false;
    economicImpactStore.isAddModelOpen = true;
  }, [economicImpactStore]);

  useEffect(() => {
    async function loadRequests() {
      let selectedTrustId = window.sessionStorage.getItem("selectedTrustId")
      economicImpactStore.dashboardData = null;
      await economicImpactStore.getEconomicImpactDashboardByTrustId(selectedTrustId as string, 0, "ALL", "ALL");
    }
    loadRequests();
  }, []);

  return (
    economicImpactStore.isAddModelOpen ? (
      economicImpactStore.isBulkUploadMode ? (
        <EconomicImpactUpload />
      ) : (
        <EconomicImpactForm
          close={() => economicImpactStore.isAddModelOpen = false}
          economicImpactStore={economicImpactStore}
          trustStore={trustStore}
        />
      )
    ) : (
      <div className=" mx-auto p-8">
        <GoBack action={() => navigate(-1)} trustName={name || ""} page="Economic Impact" />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Economic Impact of HCDT in Host Communities
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Charts</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!isTableView}
                  onChange={() => setIsTableView(!isTableView)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
              </label>
              <span className="text-sm text-gray-600 ml-2">Table</span>
            </div>
            <Button
              onClick={openAddForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              buttonText="Add Report"
              width="w-fit"
              type="button"
            />
            {authStore.user.role === "SUPER ADMIN" || authStore.user.role === "ADMIN"&& (
              <Button
                onClick={() => {
                  economicImpactStore.isBulkUploadMode = true;
                  economicImpactStore.isAddModelOpen = true;
                }}
                buttonText="Bulk Upload"
                width="w-fit"
                padding="px-4 py-2"
                iconLeft={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                }
              />
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          Percent of host community members who reported that their income and
          livelihood have improved as a result of the activities/projects
          implemented by the HCDT
        </p>
        <p className="text-sm text-gray-500">
          These are your personal details, they are visible to the public
        </p>

        <div className="mt-4 bg-white  rounded-lg ">
          {isTableView && (
            <div>
              {economicImpactStore.isDashboardLoading ? (
                <DashboardSkeleton />
              ) : (<EconomicImpactDashboard economicImpactStore={economicImpactStore} />)}
            </div>
          )}
          {!isTableView && (
            <div><EconomicImpactTable /></div>
          )}
        </div>
      </div>
    )
  );
});

export default EconomicImpact;