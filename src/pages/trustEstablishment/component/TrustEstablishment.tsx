import { useParams, useNavigate } from "react-router-dom";
import { DashboardSkeleton, GoBack } from "../../../components/elements";
import { createContext, useCallback, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { trustEstablishmentStore as TrustEstablishmentStore } from "../store/trustEstablishmentStore";
import { settingStore as SettingStore } from "../../Settings/store/settingStore";
import EstablishmentDashboard from "./chart/EstablishmentDashboard";
import TrustEstablishmentForm from "./forms/TrustEstablishmentForm";
import EditTrustEstablishmentForm from "./forms/EditTrustEstablishmentForm";


const SettingStoreCTx = createContext(SettingStore);
const trustEstablishmentStoreCTx = createContext(TrustEstablishmentStore);

const TrustEstablishment = observer(() => {
  const trustEstablishmentStore = useContext(trustEstablishmentStoreCTx);
  const settingStore = useContext(SettingStoreCTx);
  const { name } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getInfo() {
      let selectedTrustId = window.sessionStorage.getItem("selectedTrustId")
      trustEstablishmentStore.dashboardData = null;
      // await trustEstablishmentStore.getSingleTrustEstablishmentStatus(selectedTrustId as string)
      await trustEstablishmentStore.getFundsDashboardByTrustIdAndYear(selectedTrustId as string, 0)
      await trustEstablishmentStore.getEstablishmentDashboardByTrustId(selectedTrustId as string)
      await settingStore.getAllAdmin();
    }
    getInfo();
    return () => { };
  }, []);
  const setSwitch = useCallback(() => {
    if (trustEstablishmentStore.isEstablishmentCreated) {
      trustEstablishmentStore.pageSwitch = 3;
    } else {
      trustEstablishmentStore.pageSwitch = 2;
    }
  }, [trustEstablishmentStore]);
  return (
    <div className="py-4 px-7">
      <section>
        {trustEstablishmentStore.pageSwitch == 1 && (
          <div>
            {trustEstablishmentStore.isDashboardLoading ? (
              <DashboardSkeleton />
            ) : (
              <>
                <GoBack action={() => navigate(-1)} trustName={name || ""} page="Trust Establishment" />
                <div className="my-7 flex items-center justify-between">
                  <h2 className="font-semibold text-2xl text-black capitalize">
                    Trust Establishment and Governance <br /> Structure Dashboard
                  </h2>
                  <button className="px-3 py-2 rounded-md border border-black text-black font-medium text-sm" onClick={setSwitch}>
                    {trustEstablishmentStore.isEstablishmentCreated ? "Edit Establishment" : "Create Establishment"}
                  </button>
                </div>
                <EstablishmentDashboard />
              </>
            )}
          </div>
        )}

        {trustEstablishmentStore.pageSwitch == 2 && (
          <div><TrustEstablishmentForm /></div>
        )}

        {trustEstablishmentStore.pageSwitch == 3 && (
          <div><EditTrustEstablishmentForm /></div>
        )}
      </section>
    </div>
  );
});

export default TrustEstablishment;
