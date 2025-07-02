import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { dashboardStore as DashboardStore } from "./../store/dashboardStore"
import { economicImpactStore as EconomicImpactStore } from "../../EconomicImpact/store/economicImpactStore";
import { satisfactionStore as SatisfactionStore } from "../../communitySatisfaction/store/satisfactionStore";
import { conflictStore as ConflictStore } from "../../conflict/store/conflictStore";
import { projectStore as ProjectStore } from "../../project/store/projectStore";
import { trustStore as TrustStore } from "../../trust/store/trustStore";
import { settingStore as SettingStore } from "../../Settings/store/settingStore";
import { observer } from "mobx-react-lite";
import BiggerSkeleton from "../../../components/elements/BiggerSkeleton";
interface LayoutProps {
  children: ReactNode;
}


const DashboardStoreCTX = createContext(DashboardStore)
const trustStoreCTX = createContext(TrustStore)
const economicImpactStoreCTX = createContext(EconomicImpactStore)
const satisfactionStoreCTX = createContext(SatisfactionStore)
const conflictStoreCTX = createContext(ConflictStore)
const projectStoreCTX = createContext(ProjectStore)
const settingStoreCTX = createContext(SettingStore)
const EntryDashboard: React.FC<LayoutProps> = observer(({ children }) => {
  const dashboardStore = useContext(DashboardStoreCTX)
  const settingStore = useContext(settingStoreCTX)
  const trustStore = useContext(trustStoreCTX)
  const economicImpactStore = useContext(economicImpactStoreCTX)
  const satisfactionStore = useContext(satisfactionStoreCTX)
  const conflictStore = useContext(conflictStoreCTX)
  const projectStore = useContext(projectStoreCTX)
  useEffect(() => {
    async function getInfo() {
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
  }, [dashboardStore, settingStore, trustStore, economicImpactStore, satisfactionStore, conflictStore, projectStore]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-md sticky top-0 z-50 ">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
        <div className="text-xl lg:text-2xl font-bold relative">
          <span className="text-2xl font-bold text-black">I-HCDT</span>
          <span className="text-xs block text-[#003B99] absolute-bottom-2 tracking-widest">Monitor</span>
        </div>

          {/* Buttons */}
          <div className="space-x-4">
            <Link
              to={`/auth/${1}`}
              className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
            // onClick={navigateLogin}
            >
              Login
            </Link>
            <Link
              to={`/auth/${2}`}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-2">
      
        {dashboardStore.isLoading || settingStore.isLoading ? (
          <BiggerSkeleton/>
        ) : (
          <>
            {children}
          </>
        )}
        </main>
    </div>
  );
});

export default EntryDashboard;
