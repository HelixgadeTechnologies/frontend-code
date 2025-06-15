import { createContext, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { DashboardSkeleton } from "../../components/elements";
import DashboardPage from "./component/DashboardPage";
import { dashboardStore as DashboardStore } from "./store/dashboardStore"
import { economicImpactStore as EconomicImpactStore } from "../EconomicImpact/store/economicImpactStore";
import { satisfactionStore as SatisfactionStore } from "../communitySatisfaction/store/satisfactionStore";
import { conflictStore as ConflictStore } from "../conflict/store/conflictStore";
import { projectStore as ProjectStore } from "../project/store/projectStore";

const DashboardStoreCTX = createContext(DashboardStore)
const economicImpactStoreCTX = createContext(EconomicImpactStore)
const satisfactionStoreCTX = createContext(SatisfactionStore)
const conflictStoreCTX = createContext(ConflictStore)
const projectStoreCTX = createContext(ProjectStore)
const DashboardMasterPage = observer(() => {
    const dashboardStore = useContext(DashboardStoreCTX)
    const economicImpactStore = useContext(economicImpactStoreCTX)
    const satisfactionStore = useContext(satisfactionStoreCTX)
    const conflictStore = useContext(conflictStoreCTX)
    const projectStore = useContext(projectStoreCTX)
    useEffect(() => {
        async function getInfo() {
            await dashboardStore.getDashboard()
            economicImpactStore.isDashboardLoading = false;
            economicImpactStore.dashboardData = null;
            await economicImpactStore.getEconomicImpactDashboardByTrustId("ALL");
            satisfactionStore.isDashboardLoading = false;
            satisfactionStore.dashboardData = null;
            await satisfactionStore.getSatisfactionDashboardByTrustId("ALL");
            conflictStore.isDashboardLoading = false;
            conflictStore.dashboardData = null;
            await conflictStore.getConflictDashboardByTrustId("ALL");
            projectStore.isDashboardLoading = false;
            projectStore.dashboardData = null;
            await projectStore.getProjectDashboardByTrustId("ALL");
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