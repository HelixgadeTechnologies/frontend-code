import { createContext, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { DashboardSkeleton } from "../../components/elements";
import DashboardPage from "./component/DashboardPage";
import { dashboardStore as DashboardStore } from "./store/dashboardStore"
const DashboardStoreCTX = createContext(DashboardStore)
const DashboardMasterPage = observer(() => {
    const dashboardStore = useContext(DashboardStoreCTX)
    useEffect(() => {
        async function getInfo() {
            await dashboardStore.getDashboard()
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