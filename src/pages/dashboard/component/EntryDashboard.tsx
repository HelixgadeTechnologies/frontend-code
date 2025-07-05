import React, { createContext, ReactNode, useCallback, useContext, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { dashboardStore as DashboardStore } from "./../store/dashboardStore"
import { economicImpactStore as EconomicImpactStore } from "../../EconomicImpact/store/economicImpactStore";
import { satisfactionStore as SatisfactionStore } from "../../communitySatisfaction/store/satisfactionStore";
import { conflictStore as ConflictStore } from "../../conflict/store/conflictStore";
import { projectStore as ProjectStore } from "../../project/store/projectStore";
import { trustStore as TrustStore } from "../../trust/store/trustStore";
import { settingStore as SettingStore } from "../../Settings/store/settingStore";
import { observer } from "mobx-react-lite";
import BiggerSkeleton from "../../../components/elements/BiggerSkeleton";
import GeneralProjectTable from "../../project/components/table/GeneralProjectTable";
// import ProjectView from "../../project/components/modal/ProjectView";
import { IProjectView } from "../../project/types/interface";
import GeneralProjectView from "../../project/components/modal/GeneralProjectView";
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
      await projectStore.getProjectsForGeneralProject();
      await settingStore.getAllSettlor();
      await trustStore.getAllTrust();
    }
    getInfo();
    return () => { };
  }, [dashboardStore, settingStore, trustStore, economicImpactStore, satisfactionStore, conflictStore, projectStore]);
  const selectTab = useCallback((v: number) => {
    async function getInfo() {
      dashboardStore.selectedTab = v;
    }
    getInfo()
  }, [projectStore]);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="w-full bg-white shadow-md sticky top-0 z-50 ">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
          <div className="text-xl lg:text-2xl font-bold relative">
            <span className="text-2xl font-bold text-black">I-HCDT</span>
            <span className="text-xs block text-[#003B99] absolute-bottom-2 tracking-widest">Monitor</span>
          </div>

         
          <div className="space-x-4">
            <NavLink
              to="#"
              className={
                dashboardStore.selectedTab === 0
                  ? "font-medium text-blue-700 border-b-2 border-blue-700 pb-1"
                  : "font-medium text-black hover:text-blue-700"
              }
              onClick={() => selectTab(0)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="#"
              className={
                (dashboardStore.selectedTab === 1 || dashboardStore.selectedTab === 2)
                  ? "font-medium text-blue-700 border-b-2 border-blue-700 pb-1"
                  : "font-medium text-black hover:text-blue-700"
              }
              onClick={() => selectTab(1)}
            >
              Project
            </NavLink>
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
      </header> */}
      <header className="w-full bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex-1">
            <div className="text-xl lg:text-2xl font-bold relative w-fit">
              <span className="text-2xl font-bold text-black">I-HCDT</span>
              <span className="text-xs block text-[#003B99] absolute -bottom-2 left-0 tracking-widest">Monitor</span>
            </div>
          </div>

          {/* Center: Nav */}
          <div className="flex-1 flex justify-center space-x-8">
            <NavLink
              to="#"
              className={
                dashboardStore.selectedTab === 0
                  ? "font-medium text-blue-700 border-b-2 border-blue-700 pb-1"
                  : "font-medium text-black hover:text-blue-700"
              }
              onClick={() => selectTab(0)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="#"
              className={
                (dashboardStore.selectedTab === 1 || dashboardStore.selectedTab === 2)
                  ? "font-medium text-blue-700 border-b-2 border-blue-700 pb-1"
                  : "font-medium text-black hover:text-blue-700"
              }
              onClick={() => selectTab(1)}
            >
              Project
            </NavLink>
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex-1 flex justify-end space-x-4">
            <Link
              to={`/auth/${1}`}
              className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
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
        {dashboardStore.selectedTab == 0 && (
          <>
            {dashboardStore.isLoading || settingStore.isLoading ? (
              <BiggerSkeleton />
            ) : (
              <>
                {children}
              </>
            )}
          </>
        )}

        {dashboardStore.selectedTab == 1 && (
          <GeneralProjectTable />
        )}

        {dashboardStore.selectedTab == 2 && (
          <GeneralProjectView projectData={projectStore.selectedProject as IProjectView} dashboardStore={dashboardStore} />
        )}

      </main>
    </div>
  );
});

export default EntryDashboard;
