import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
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
// import GeneralProjectTable from "../../project/components/table/GeneralProjectTable";
import { IProjectView } from "../../project/types/interface";
import GeneralProjectView from "../../project/components/modal/GeneralProjectView";
import GeneralTrust from "../../trust/components/table/GeneralTrust";
import GeneralProjectDashboard from "../../project/components/chat/GeneralProjectDashboard";
import { routes2 } from "../../../utils/data";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState<number | null>(null);


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
    dashboardStore.selectedTab = v;
  }, [dashboardStore]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`
    ${!sidebarOpen ? "hidden lg:block" : ""}
    z-40 bg-white shadow-lg 
    lg:fixed lg:inset-y-0 lg:left-0 lg:w-36
    transform transition-transform duration-200 ease-in-out
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div
              onClick={() => window.location.href = "https://hcdtmonitor.org"}
              className="text-xl lg:text-2xl font-bold relative w-fit cursor-pointer"
            >
              <span className="text-2xl font-bold text-black block">I-HCDT</span>
              <span className="text-xs block text-[#003B99] mt-1 tracking-widest">
                Monitor
              </span>
            </div>
            <button
              className="lg:hidden text-gray-500"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="flex-1 flex flex-col py-8">
            <nav className="flex flex-col gap-1 px-4">
              {routes2.slice(0, 2).map((route) => (
                <div key={route.link}>
                  <NavLink
                    to="#"
                    className={
                      dashboardStore.selectedTab === route.link
                        ? "flex items-center px-4 py-2 rounded bg-blue-50 text-blue-700 font-semibold transition"
                        : "flex items-center px-4 py-2 rounded text-gray-700 hover:bg-gray-100 transition"
                    }
                    onClick={() => {
                      selectTab(route.link);
                      setSidebarOpen(false);
                      setOpen(open === route.id ? null : route.id);
                    }}
                  >
                    {/* Optional: <img src={route.icon} alt={route.name} className="mr-2 w-4 h-4" /> */}
                    <span className="text-sm font-medium">{route.name}</span>
                    {route.children && route.children.length > 0 && (
                      <svg
                        className={`ml-auto w-4 h-4 transition-transform ${open === route.id ? "rotate-90" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </NavLink>
                  {/* Children */}
                  {route.children && route.children.length > 0 && open === route.id && (
                    <ul className="ml-6 mt-1 flex flex-col gap-1">
                      {route.children.map(child => (
                        <li key={child.id}>
                          <button
                            className={`w-full text-left px-3 py-1 rounded text-sm transition ${location.pathname.includes(child.link)
                                ? "bg-blue-50 text-blue-700 font-semibold"
                                : "hover:bg-gray-50 text-gray-600"
                              }`}
                            onClick={() => {
                              const el = document.getElementById(child.link);
                              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}
                            type="button"
                          >
                            <span className="font-medium text-xs text-gray-600">{child.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </nav>
          </div>

        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-36">
        {/* Header */}
        <header className="w-full bg-white shadow-md sticky top-0 z-30 flex items-center px-4 py-3" style={{ height: "85px" }}>
          <button
            className="lg:hidden mr-4 text-2xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <div className="flex-1 flex items-center justify-between">
            <div>
              <div
                onClick={() => window.location.href = "https://hcdtmonitor.org"}
                className="text-xl lg:text-2xl font-bold relative w-fit cursor-pointer block md:hidden"
              >
                <span className="text-2xl font-bold text-black block">I-HCDT</span>
                <span className="text-xs block text-[#003B99] mt-1 tracking-widest">
                  Monitor
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
        <main className="flex-1 w-full px-2 sm:px-6 py-2">
          {dashboardStore.selectedTab === 0 && (
            <>
              {dashboardStore.isLoading || settingStore.isLoading ? (
                <BiggerSkeleton />
              ) : (
                <>{children}</>
              )}
            </>
          )}
          {dashboardStore.selectedTab === 1 && <GeneralTrust />}
          {dashboardStore.selectedTab === 2 && (<GeneralProjectDashboard />)}
          {dashboardStore.selectedTab === 3 && (
            <GeneralProjectView
              dashboardStore={dashboardStore}
              projectData={projectStore.selectedProject as IProjectView}
            />
          )}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
});

export default EntryDashboard;
