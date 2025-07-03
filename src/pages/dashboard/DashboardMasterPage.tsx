import { createContext, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { DashboardSkeleton } from "../../components/elements";
import DashboardPage from "./component/DashboardPage";
import { dashboardStore as DashboardStore } from "./store/dashboardStore"
import { economicImpactStore as EconomicImpactStore } from "../EconomicImpact/store/economicImpactStore";
import { satisfactionStore as SatisfactionStore } from "../communitySatisfaction/store/satisfactionStore";
import { conflictStore as ConflictStore } from "../conflict/store/conflictStore";
import { projectStore as ProjectStore } from "../project/store/projectStore";
import { trustStore as TrustStore } from "../trust/store/trustStore";
import { settingStore as SettingStore } from "../Settings/store/settingStore";

const DashboardStoreCTX = createContext(DashboardStore)
const trustStoreCTX = createContext(TrustStore)
const economicImpactStoreCTX = createContext(EconomicImpactStore)
const satisfactionStoreCTX = createContext(SatisfactionStore)
const conflictStoreCTX = createContext(ConflictStore)
const projectStoreCTX = createContext(ProjectStore)
const settingStoreCTX = createContext(SettingStore)
const DashboardMasterPage = observer(() => {
    const dashboardStore = useContext(DashboardStoreCTX)
    const settingStore = useContext(settingStoreCTX)
    const trustStore = useContext(trustStoreCTX)
    const economicImpactStore = useContext(economicImpactStoreCTX)
    const satisfactionStore = useContext(satisfactionStoreCTX)
    const conflictStore = useContext(conflictStoreCTX)
    const projectStore = useContext(projectStoreCTX)
    useEffect(() => {
        async function getInfo() {
            dashboardStore.selectedTrust = "ALL";
            dashboardStore.selectedSettlor = "ALL";
            dashboardStore.selectedState = "ALL";
            dashboardStore.selectedYear = 0;
            dashboardStore.dashboardData = null;
            trustStore.getAllStates()
            await dashboardStore.getDashboard("ALL", 0, "ALL", "ALL")
            economicImpactStore.isDashboardLoading = false;
            economicImpactStore.dashboardData = null;
            await economicImpactStore.getEconomicImpactDashboardByTrustId("ALL", 0, "ALL", "ALL");
            satisfactionStore.isDashboardLoading = false;
            satisfactionStore.dashboardData = null;
            await satisfactionStore.getSatisfactionDashboardByTrustId("ALL", 0, "ALL", "ALL");
            conflictStore.isDashboardLoading = false;
            conflictStore.dashboardData = null;
            await conflictStore.getConflictDashboardByTrustId("ALL", 0, "ALL", "ALL");
            projectStore.isDashboardLoading = false;
            projectStore.dashboardData = null;
            await projectStore.getProjectDashboardByTrustId("ALL", 0, "ALL", "ALL");
            await settingStore.getAllSettlor();
            await trustStore.getAllTrust();
        }
        getInfo();
        return () => { };
    }, []);


    return (
        <>
            {dashboardStore.isLoading ? (
                <DashboardSkeleton />
            ) : (<DashboardPage />
            )}
        </>
    );

});

export default DashboardMasterPage;